"use client";

import { FormEvent, useState } from "react";

interface InquiryFormProps {
  propertyName?: string;
  compact?: boolean;
}

export default function InquiryForm({ propertyName, compact = false }: InquiryFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 429) {
        setErrorMessage("You've sent a few messages already - please wait a bit before trying again.");
        setStatus("error");
        return;
      }

      if (res.status === 400) {
        const body = await res.json().catch(() => ({}));
        setErrorMessage(body.error || "Please check the form and try again.");
        setStatus("error");
        return;
      }

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-5 text-sm text-emerald-800">
        Thank you! Your inquiry has been sent. Our team will get back to you shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {propertyName && <input type="hidden" name="property" value={propertyName} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-semibold text-heading">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            placeholder="Juan Dela Cruz"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-xs font-semibold text-heading">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            required
            className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            placeholder="09xx xxx xxxx"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-xs font-semibold text-heading">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          placeholder="you@email.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-xs font-semibold text-heading">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={compact ? 3 : 4}
          className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          placeholder={
            propertyName
              ? `I'd like to know more about ${propertyName}.`
              : "Tell us what you're looking for."
          }
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send Inquiry"}
      </button>

      {status === "error" && errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
    </form>
  );
}
