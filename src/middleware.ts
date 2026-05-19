import { NextRequest, NextResponse } from "next/server";
import { REFERRAL_COOKIE, REFERRAL_MAX_AGE } from "@/lib/referrals";

export function middleware(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref) return NextResponse.next();

  const res = NextResponse.next();
  res.cookies.set(REFERRAL_COOKIE, ref.toUpperCase().slice(0, 32), {
    httpOnly: false,
    sameSite: "lax",
    maxAge: REFERRAL_MAX_AGE,
    path: "/",
  });
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon|robots|sitemap).*)"],
};
