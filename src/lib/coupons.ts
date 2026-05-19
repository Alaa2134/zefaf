// Coupon code engine — hardcoded for MVP, easy to extend to DB-backed.

export interface Coupon {
  code: string;
  discountType: "percent" | "fixed";
  amount: number; // percent (0-100) or EGP fixed
  validFor?: ("basic" | "premium" | "vip")[];
  expiresAt?: string;
  description: string;
}

export const COUPONS: Coupon[] = [
  { code: "FARHET10", discountType: "fixed", amount: 10, description: "خصم ١٠ ج للعرسان الجدد" },
  { code: "EID2026", discountType: "percent", amount: 20, description: "خصم ٢٠٪ بمناسبة العيد" },
  { code: "PREMIUM50", discountType: "fixed", amount: 50, validFor: ["premium", "vip"], description: "خصم ٥٠ ج على بريميام و VIP" },
  { code: "VIP100", discountType: "fixed", amount: 100, validFor: ["vip"], description: "خصم ١٠٠ ج على باقة VIP" },
];

export function findCoupon(code: string): Coupon | undefined {
  const norm = code.trim().toUpperCase();
  return COUPONS.find((c) => c.code === norm);
}

export function applyCoupon(
  coupon: Coupon,
  tier: "basic" | "premium" | "vip",
  basePrice: number
): { valid: boolean; reason?: string; finalPrice: number; discount: number } {
  if (coupon.validFor && !coupon.validFor.includes(tier)) {
    return {
      valid: false,
      reason: "الكود ده مش متاح للباقة دي",
      finalPrice: basePrice,
      discount: 0,
    };
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, reason: "الكود انتهت صلاحيته", finalPrice: basePrice, discount: 0 };
  }
  const discount =
    coupon.discountType === "percent"
      ? Math.round((basePrice * coupon.amount) / 100)
      : Math.min(coupon.amount, basePrice);
  return { valid: true, finalPrice: Math.max(0, basePrice - discount), discount };
}
