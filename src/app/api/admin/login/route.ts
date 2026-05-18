import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminPassword } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body?.password === getAdminPassword()) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, getAdminPassword(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  }
  return NextResponse.json({ error: "كلمة السر غير صحيحة" }, { status: 401 });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
