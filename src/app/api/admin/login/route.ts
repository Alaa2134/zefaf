import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  verifyPassword,
  sessionToken,
  checkRateLimit,
  recordFailedAttempt,
  clearAttempts,
} from "@/lib/admin";

function getClientKey(req: NextRequest): string {
  // Fall back to a generic key so the limiter still works when no headers are available
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  return `login:${ip}`;
}

export async function POST(req: NextRequest) {
  const key = getClientKey(req);
  const limit = checkRateLimit(key);
  if (!limit.allowed) {
    const minutes = Math.ceil((limit.resetAt - Date.now()) / 60000);
    return NextResponse.json(
      { error: `محاولات كتير، جرّب تاني بعد ${minutes} دقيقة` },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const password = String(body?.password ?? "");
  const ok = await verifyPassword(password);

  if (!ok) {
    recordFailedAttempt(key);
    return NextResponse.json({ error: "كلمة السر غير صحيحة" }, { status: 401 });
  }

  clearAttempts(key);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 14, // 14 days
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
