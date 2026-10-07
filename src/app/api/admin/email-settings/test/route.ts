import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import { withStoredPassword } from "@/data/email-settings";
import { parseEmailSettings } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const input = parseEmailSettings(await request.json().catch(() => null));

  if (!input) {
    return NextResponse.json({ error: "Invalid email settings" }, { status: 400 });
  }

  const body = withStoredPassword(input);

  if (!body.smtpHost || !body.smtpUser || !body.smtpPass || !body.contactEmail) {
    return NextResponse.json({ error: "Fill in all fields before sending a test" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: body.smtpHost,
    port: body.smtpPort,
    secure: body.smtpPort === 465,
    auth: { user: body.smtpUser, pass: body.smtpPass },
  });

  try {
    await transporter.sendMail({
      from: body.smtpFrom || body.smtpUser,
      to: body.contactEmail,
      replyTo: body.smtpUser,
      subject: "Mayap Realty - Test Email",
      html: "<p>This is a test email from your website's admin settings. If you received this, email notifications are working.</p>",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send test email" },
      { status: 500 }
    );
  }
}
