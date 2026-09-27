import { Resend } from "resend";
import nodemailer from "nodemailer";
import { site } from "@/config/site";

export type Lead = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  budget: string;
  message: string;
  page: string;
};

const LIMITS: Record<keyof Lead, number> = {
  name: 100,
  email: 200,
  phone: 30,
  interest: 100,
  budget: 100,
  message: 5000,
  page: 300,
};

/** Returns a clean Lead, or an error message for the visitor. */
export function parseLead(input: unknown): { lead: Lead } | { error: string } {
  if (!input || typeof input !== "object") return { error: "Invalid request." };
  const raw = input as Record<string, unknown>;

  // Honeypot: real visitors never see or fill this field.
  if (typeof raw.company === "string" && raw.company.trim() !== "") return { error: "spam" };

  const lead = {} as Lead;
  for (const key of Object.keys(LIMITS) as (keyof Lead)[]) {
    const value = typeof raw[key] === "string" ? (raw[key] as string).trim() : "";
    lead[key] = value.slice(0, LIMITS[key]);
  }

  if (!lead.name) return { error: "Please add your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return { error: "Please add a valid email." };
  if (!lead.message) return { error: "Please add a short message." };
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
