// Lightweight referral tracking: ?ref=CODE on any link sets a cookie that
// flows into the order. Pure server-side, no client JS needed.

import { cookies } from "next/headers";

export const REFERRAL_COOKIE = "zefaf_ref";
export const REFERRAL_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function readReferral(): Promise<string | undefined> {
  const c = await cookies();
  return c.get(REFERRAL_COOKIE)?.value;
}
