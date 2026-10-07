"use client";

import { FormEvent, useState } from "react";
import type { PublicEmailSettings } from "@/data/email-settings";
import { EmailSettings } from "@/lib/types";

export default function EmailSettingsForm({ initialSettings }: { initialSettings: PublicEmailSettings }) {
  const [smtpHost, setSmtpHost] = useState(initialSettings.smtpHost || "smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState(String(initialSettings.smtpPort || 587));
  const [smtpUser, setSmtpUser] = useState(initialSettings.smtpUser);
  // The saved password is never sent to the browser. Leaving this blank
  // keeps it; typing a new one replaces it.
  const [smtpPass, setSmtpPass] = useState("");
  const [hasPassword, setHasPassword] = useState(initialSettings.hasPassword);
  // No input for this yet - it's preserved as-is so saving doesn't wipe it.
  const [smtpFrom] = useState(initialSettings.smtpFrom);
  const [contactEmail, setContactEmail] = useState(initialSettings.contactEmail);
  const [showPass, setShowPass] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function buildPayload(): EmailSettings {
    return {
      smtpHost: smtpHost.trim(),
      smtpPort: Number(smtpPort) || 587,
      smtpUser: smtpUser.trim(),
      smtpPass,
      smtpFrom: smtpFrom.trim(),
      contactEmail: contactEmail.trim(),
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/email-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save email settings");
      }

      const data = await res.json().catch(() => ({}));
      setHasPassword(Boolean(data.settings?.hasPassword));
      setSmtpPass("");
      setMessage({ type: "success", text: "Email settings saved." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to save" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTest() {
    setTesting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/email-settings/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Test email failed");
      }

      setMessage({ type: "success", text: `Test email sent to ${contactEmail}. Check your inbox.` });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Test email failed" });
    } finally {
      setTesting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-black/5 bg-white p-6 shadow-sm space-y-4">
      <div>
        <h2 className="font-bold text-heading">Email Notifications (Gmail SMTP)</h2>
        <p className="mt-1 text-sm text-body">
          Sends you an email every time someone submits an inquiry. Inquiries are always saved to{" "}
          <span className="font-medium text-heading">/admin/inquiries</span> regardless of whether this is set up.
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-body">
          <li>
            Turn on 2-Step Verification on the Gmail account:{" "}
            <a
              href="https://myaccount.google.com/security"
              target="_blank"
              rel="noreferrer"
              className="text-brand hover:text-brand-dark"
            >
              myaccount.google.com/security
            </a>
          </li>
          <li>
            Create an App Password (choose &ldquo;Mail&rdquo;):{" "}
            <a
              href="https://myaccount.google.com/apppasswords"
              target="_blank"
              rel="noreferrer"
              className="text-brand hover:text-brand-dark"
            >
              myaccount.google.com/apppasswords
            </a>
          </li>
          <li>Paste the 16-character app password below (not your normal Gmail password).</li>
        </ol>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-heading">SMTP Host</label>
          <input
            value={smtpHost}
            onChange={(e) => setSmtpHost(e.target.value)}
            className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-heading">SMTP Port</label>
          <input
            value={smtpPort}
            onChange={(e) => setSmtpPort(e.target.value)}
            className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-heading">Gmail Address</label>
          <input
            type="email"
            value={smtpUser}
            onChange={(e) => setSmtpUser(e.target.value)}
            placeholder="you@gmail.com"
            className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-heading">App Password</label>
          <div className="flex gap-2">
            <input
              type={showPass ? "text" : "password"}
              value={smtpPass}
              onChange={(e) => setSmtpPass(e.target.value)}
              placeholder={hasPassword ? "Saved - leave blank to keep" : "16-character app password"}
              autoComplete="new-password"
              className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="shrink-0 rounded-md border border-black/10 px-3 text-xs font-semibold text-heading hover:bg-cream"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-heading">
          Inbox to Receive Inquiries <span className="font-normal text-body">(can be the same Gmail address)</span>
        </label>
        <input
          type="email"
          required
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
        />
      </div>

      {message && (
        <p className={`text-sm ${message.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
          {message.text}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save Email Settings"}
        </button>
        <button
          type="button"
          onClick={handleTest}
          disabled={testing}
          className="rounded-md border border-black/10 px-6 py-3 text-sm font-semibold text-heading hover:bg-cream disabled:opacity-60"
        >
          {testing ? "Sending..." : "Send Test Email"}
        </button>
      </div>
    </form>
  );
}
