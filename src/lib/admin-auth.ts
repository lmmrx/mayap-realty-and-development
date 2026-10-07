import crypto from "node:crypto";
import { getSessionVersion } from "@/data/session-security";

const isProd = process.env.NODE_ENV === "production";

// The __Host- prefix is only accepted by browsers on cookies that are
// Secure, Path=/, and carry no Domain attribute - it stops the cookie from
// being overwritten or read by a subdomain or a non-HTTPS origin. It
// requires HTTPS, so it's only used in production.
export const ADMIN_COOKIE_NAME = isProd ? "__Host-mayap_admin" : "mayap_admin";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
export const ADMIN_COOKIE_MAX_AGE = SESSION_DURATION_MS / 1000;

export function getAdminCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set. Add it to your .env.local file.");
  }
  return secret;
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return crypto.timingSafeEqual(bufferA, bufferB);
}

export function createSessionToken(): string {
  const expiry = Date.now() + SESSION_DURATION_MS;
  const version = getSessionVersion();
  const payload = `${expiry}.${version}`;
  const signature = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expiryStr, versionStr, signature] = token.split(".");
  if (!expiryStr || !versionStr || !signature) return false;

  const expiry = Number(expiryStr);
  const version = Number(versionStr);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;
  if (!Number.isFinite(version) || version !== getSessionVersion()) return false;

  const payload = `${expiryStr}.${versionStr}`;
  const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  return timingSafeEqualStrings(signature, expected);
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("ADMIN_PASSWORD is not set. Add it to your .env.local file.");
  }
  return timingSafeEqualStrings(password, expected);
}
