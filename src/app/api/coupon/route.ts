import { NextRequest, NextResponse } from "next/server";
import { findCoupon, applyCoupon } from "@/lib/coupons";
import { TIERS, type TierId } from "@/lib/config";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const code = String(body?.code ?? "");
  const tier = (body?.tier as TierId) || "basic";
  if (!code) return NextResponse.json({ valid: false, reason: "اكتب الكود" });

  const coupon = findCoupon(code);
  if (!coupon) {
    return NextResponse.json({ valid: false, reason: "الكود غير موجود" });
  }
  const result = applyCoupon(coupon, tier, TIERS[tier].price);
  return NextResponse.json({
    valid: result.valid,
    reason: result.reason,
    discount: result.discount,
    finalPrice: result.finalPrice,
    description: coupon.description,
  });
}
