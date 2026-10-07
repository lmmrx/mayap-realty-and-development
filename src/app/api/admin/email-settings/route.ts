import { NextRequest, NextResponse } from "next/server";
import { updateEmailSettings } from "@/data/email-settings";
import { parseEmailSettings } from "@/lib/validation";

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const input = parseEmailSettings(body);

  if (!input) {
    return NextResponse.json({ error: "Invalid email settings" }, { status: 400 });
  }

  const settings = updateEmailSettings(input);
  return NextResponse.json({ settings });
}
