/**
 * Admin session auth — HMAC-signed expiry tokens in an httpOnly cookie.
 * Uses Web Crypto only, so it runs both in edge middleware and node routes.
 */

export const ADMIN_COOKIE = "bg_admin";
const SESSION_HOURS = 24 * 7;

const enc = new TextEncoder();

function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(value: string): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET not set");
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, enc.encode(value)));
}

export async function sha256Hex(value: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", enc.encode(value)));
}

/** `exp.hmac(exp)` — no user data in the token; there is exactly one admin. */
export async function createSessionToken(): Promise<string> {
  const exp = String(Date.now() + SESSION_HOURS * 3600_000);
  return `${exp}.${await hmac(exp)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  try {
    return (await hmac(exp)) === sig;
  } catch {
    return false;
  }
}

export async function verifyCredentials(email: string, password: string): Promise<boolean> {
  const wantEmail = process.env.ADMIN_EMAIL;
  const wantHash = process.env.ADMIN_PASSWORD_HASH;
  if (!wantEmail || !wantHash) return false;
  if (email.trim().toLowerCase() !== wantEmail.toLowerCase()) return false;
  return (await sha256Hex(password)) === wantHash;
}
