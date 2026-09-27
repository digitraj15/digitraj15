import { NextResponse } from "next/server";
import { deliverLead, parseLead } from "@/lib/lead";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseLead(body);
  if ("error" in parsed) {
    // Pretend spam succeeded so bots don't retry.
    if (parsed.error === "spam") return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const { delivered, errors } = await deliverLead(parsed.lead);
  if (errors.length) console.error("[lead]", errors.join(" | "));

  if (delivered.length === 0) {
    return NextResponse.json(
      { ok: false, error: "We couldn't send your message. Please email or WhatsApp us instead." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
