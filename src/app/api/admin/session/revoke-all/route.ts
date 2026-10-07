import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminCookieOptions } from "@/lib/admin-auth";
import { bumpSessionVersion } from "@/data/session-security";

export async function POST() {
  bumpSessionVersion();

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, "", getAdminCookieOptions(0));
  return response;
}
