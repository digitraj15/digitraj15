import { Resend } from "resend";
import nodemailer from "nodemailer";
import { z } from "zod";
import { site } from "@/config/site";

const text = (max: number) => z.string().trim().max(max).catch("");

const LeadSchema = z.object({
  name: z.string().trim().min(1, "Please add your name.").max(100),
  email: z.string().trim().max(200).pipe(z.email("Please add a valid email.")),
  phone: text(30),
  interest: text(100),
  budget: text(100),
  message: z.string().trim().min(1, "Please add a short message.").max(5000),
  page: text(300),
  // Honeypot: real visitors never see or fill this field.
  company: z.string().optional(),
});

export type Lead = Omit<z.infer<typeof LeadSchema>, "company">;

/** Returns a clean Lead, or an error message for the visitor. */
export function parseLead(input: unknown): { lead: Lead } | { error: string } {
  const result = LeadSchema.safeParse(input);
  if (!result.success) return { error: result.error.issues[0]?.message ?? "Invalid request." };
  const { company, ...lead } = result.data;
  if (company?.trim()) return { error: "spam" };
  return { lead };
}

function asText(lead: Lead) {
  return [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || "-"}`,
    `Interested in: ${lead.interest || "-"}`,
    `Budget: ${lead.budget || "-"}`,
    `Page: ${lead.page || "-"}`,
    "",
    lead.message,
  ].join("\n");
}

async function sendEmail(lead: Lead): Promise<string> {
  const to = process.env.LEAD_INBOX;
  if (!to) throw new Error("LEAD_INBOX is not set");
  const from = process.env.LEAD_FROM || `${site.name} <onboarding@resend.dev>`;
  const subject = `New lead: ${lead.name} — ${lead.interest || "General"}`;
  const text = asText(lead);

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({ from, to, subject, text, replyTo: lead.email });
    if (error) throw new Error(`Resend: ${error.message}`);
    return "resend";
  }

  if (process.env.SMTP_HOST) {
    const port = Number(process.env.SMTP_PORT || 587);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transport.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, text, replyTo: lead.email });
    return "smtp";
  }

  throw new Error("No email provider set (RESEND_API_KEY or SMTP_HOST)");
}

async function sendToSheet(lead: Lead): Promise<string> {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) throw new Error("APPS_SCRIPT_URL is not set");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...lead, submittedAt: new Date().toISOString() }),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Apps Script: HTTP ${res.status}`);
  return "sheet";
}

/** Sends the lead everywhere that is configured. Succeeds if at least one channel worked. */
export async function deliverLead(lead: Lead) {
  const results = await Promise.allSettled([sendEmail(lead), sendToSheet(lead)]);
  const delivered = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  const errors = results.flatMap((r) => (r.status === "rejected" ? [String(r.reason?.message ?? r.reason)] : []));
  return { delivered, errors };
}
