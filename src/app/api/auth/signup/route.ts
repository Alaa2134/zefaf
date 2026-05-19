import { NextRequest, NextResponse } from "next/server";
import { hasSupabase, supabaseAdmin } from "@/lib/supabase";
import { USER_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!hasSupabase()) {
    return NextResponse.json(
      { error: "تسجيل الدخول مش متاح حالياً — Supabase مش معدّل" },
      { status: 503 }
    );
  }
  const body = await req.json().catch(() => ({}));
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  const name = String(body?.name ?? "").trim();
  const phone = String(body?.phone ?? "").trim();

  if (!email || !password) {
    return NextResponse.json({ error: "الإيميل وكلمة السر مطلوبين" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "كلمة السر لازم ٦ حروف على الأقل" }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const { data, error } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, phone },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Sign in to get a session token
  const { data: session, error: signErr } = await sb.auth.signInWithPassword({ email, password });
  if (signErr || !session?.session) {
    return NextResponse.json({ error: signErr?.message || "خطأ في تسجيل الدخول" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true, userId: data.user?.id });
  res.cookies.set(USER_COOKIE, session.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
