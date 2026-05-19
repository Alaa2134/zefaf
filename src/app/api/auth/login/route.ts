import { NextRequest, NextResponse } from "next/server";
import { hasSupabase, supabaseAdmin } from "@/lib/supabase";
import { USER_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!hasSupabase()) {
    return NextResponse.json(
      { error: "تسجيل الدخول مش متاح حالياً" },
      { status: 503 }
    );
  }
  const body = await req.json().catch(() => ({}));
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "الإيميل وكلمة السر مطلوبين" }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error || !data?.session) {
    return NextResponse.json({ error: "الإيميل أو كلمة السر غير صحيحة" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(USER_COOKIE, data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(USER_COOKIE);
  return res;
}
