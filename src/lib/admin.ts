// Admin auth — bcrypt-hashed password support with plaintext fallback for dev
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

export const ADMIN_COOKIE = "zefaf_admin";

// In production, set ADMIN_PASSWORD_HASH to a bcrypt hash (generate with:
// node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 12))" mypassword)
// For dev/MVP, ADMIN_PASSWORD plaintext also works.
export function getAdminPasswordHash(): string | null {
  return process.env.ADMIN_PASSWORD_HASH || null;
}

export function getAdminPasswordPlain(): string {
  return process.env.ADMIN_PASSWORD || "zefaf2026";
}

export async function verifyPassword(input: string): Promise<boolean> {
  if (!input) return false;
  const hash = getAdminPasswordHash();
  if (hash) {
    try {
      return await bcrypt.compare(input, hash);
    } catch {
      return false;
    }
  }
  // Constant-time comparison for plaintext fallback
  const a = Buffer.from(input);
  const b = Buffer.from(getAdminPasswordPlain());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Stable token derived from the configured password so cookie validity
// rolls when the password changes (instead of storing the raw password).
export function sessionToken(): string {
  const secret = getAdminPasswordHash() || getAdminPasswordPlain();
  return crypto
    .createHash("sha256")
    .update("zefaf-session:" + secret)
    .digest("hex")
    .slice(0, 32);
}

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  return c.get(ADMIN_COOKIE)?.value === sessionToken();
}

// =============================================================
// In-memory rate limiter — protects login from brute force
// Lives per server instance. Good enough for MVP traffic.
// =============================================================

const ATTEMPTS = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = ATTEMPTS.get(key);
  if (!entry || entry.resetAt < now) {
    ATTEMPTS.set(key, { count: 0, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS, resetAt: now + WINDOW_MS };
  }
  return {
    allowed: entry.count < MAX_ATTEMPTS,
    remaining: Math.max(0, MAX_ATTEMPTS - entry.count),
    resetAt: entry.resetAt,
  };
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const entry = ATTEMPTS.get(key);
  if (!entry || entry.resetAt < now) {
    ATTEMPTS.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export function clearAttempts(key: string): void {
  ATTEMPTS.delete(key);
}
