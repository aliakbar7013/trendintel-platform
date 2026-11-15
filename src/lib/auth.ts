import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "trendintel_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecretKey(): string {
  return process.env.ADMIN_PASSWORD?.trim() || "TrendIntelBureauAdminPass2025!";
}

export function createSessionToken(): string {
  const secret = getSecretKey();
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`admin::${timestamp}`)
    .digest("hex");
  return `${timestamp}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestamp, signature] = parts;
  const secret = getSecretKey();
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`admin::${timestamp}`)
    .digest("hex");

  if (signature !== expected) return false;

  // Optional: check expiration (7 days)
  const tokenAge = Date.now() - parseInt(timestamp, 10);
  if (tokenAge > SESSION_MAX_AGE * 1000) return false;

  return true;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function isRequestAuthenticated(request: NextRequest): boolean {
  const token =
    request.cookies.get(SESSION_COOKIE_NAME)?.value ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return verifySessionToken(token);
}

export function setSessionCookie(response: NextResponse): void {
  const token = createSessionToken();
  const isHttps = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https");
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isHttps && process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.delete(SESSION_COOKIE_NAME);
}
