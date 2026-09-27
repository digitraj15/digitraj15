"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/config/site";
import { trackLead } from "@/lib/track";

type Status = { state: "idle" | "sending" | "done" | "error"; message?: string };

export function LeadForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus({ state: "sending" });

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, page: window.location.pathname }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) throw new Error(json.error || "Something went wrong.");
      trackLead(data.interest);
      form.reset();
      setStatus({ state: "done", message: site.leadForm.successMessage });
    } catch (err) {
      setStatus({ state: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form__row">
        <label className="field">
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required maxLength={100} />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
      </div>
      <div className="form__row">
        <label className="field">
          <span>Phone / WhatsApp (optional)</span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={30} />
        </label>
        <label className="field">
          <span>Budget</span>
          <select name="budget" defaultValue={site.leadForm.budgets.at(-1)}>
            {site.leadForm.budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        <span>What do you need?</span>
        <select name="interest">
          {site.leadForm.interests.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Tell us about the project</span>
        <textarea name="message" rows={4} required maxLength={5000} />
      </label>
      {/* Honeypot for spam bots */}
      <input className="hp" name="company" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="btn btn--block" type="submit" disabled={status.state === "sending"}>
        {status.state === "sending" ? "Sending…" : "Send"}
      </button>
      <p className={`form__status form__status--${status.state}`} role="status" aria-live="polite">
        {status.message}
      </p>
    </form>
  );
}
