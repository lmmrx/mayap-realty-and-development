import nodemailer from "nodemailer";
import { getEmailSettings } from "@/data/email-settings";
import { Inquiry } from "@/lib/types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendInquiryEmail(inquiry: Inquiry): Promise<{ sent: boolean; error?: string }> {
  const stored = getEmailSettings();

  const host = stored.smtpHost || process.env.SMTP_HOST;
  const port = Number(stored.smtpPort || process.env.SMTP_PORT || 587);
  const user = stored.smtpUser || process.env.SMTP_USER;
  const pass = stored.smtpPass || process.env.SMTP_PASS;
  const from = stored.smtpFrom || process.env.SMTP_FROM || user;
  const to = stored.contactEmail || process.env.CONTACT_EMAIL;

  if (!host || !user || !pass || !to) {
    return {
      sent: false,
      error: "Email not configured (set it up under /admin/settings or in .env.local)",
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  // The property name comes from the public form, so strip line breaks
  // before it goes into a header and escape it before it goes into HTML.
  const property = inquiry.property?.replace(/[\r\n]+/g, " ").trim();
  const subject = property ? `New inquiry: ${property}` : "New inquiry from the website";

  const html = `
    <h2>${escapeHtml(subject)}</h2>
    <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(inquiry.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
    ${inquiry.property ? `<p><strong>Property:</strong> ${escapeHtml(inquiry.property)}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p style="white-space: pre-wrap">${escapeHtml(inquiry.message || "(no message)")}</p>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: inquiry.email,
      subject,
      html,
    });
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "Unknown email error" };
  }
}
