import { NextRequest, NextResponse } from "next/server";
import { createInquiry } from "@/data/inquiries";
import { sendInquiryEmail } from "@/lib/email";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const MAX_SUBMISSIONS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Trims and caps a submitted value so one request can't bloat inquiries.json.
function field(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed, retryAfterMs } = rateLimit(`contact:${ip}`, MAX_SUBMISSIONS, WINDOW_MS);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
    );
  }

  const body = await request.json().catch(() => null);

  const name = field(body?.name, 120);
  const phone = field(body?.phone, 40);
  const email = field(body?.email, 254);
  const message = field(body?.message, 5000);
  const property = field(body?.property, 200);

  if (!name || !email || !phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  const inquiry = createInquiry({
    name,
    phone,
    email,
    message,
    property: property || undefined,
  });

  const emailResult = await sendInquiryEmail(inquiry);
  if (!emailResult.sent) {
    console.warn("Inquiry saved but email not sent:", emailResult.error);
  }

  return NextResponse.json({ ok: true });
}
