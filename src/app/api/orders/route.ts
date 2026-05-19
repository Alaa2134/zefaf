import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";
import { notifyNewOrder } from "@/lib/notify";
import { readReferral } from "@/lib/referrals";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body?.templateId || !body?.invitation || !body?.price) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }
  const ref = await readReferral();
  const user = await getCurrentUser();
  const order = await createOrder({
    templateId: body.templateId,
    tier: body.tier,
    price: body.price,
    invitation: body.invitation,
    customer: {
      ...(body.customer ?? {}),
      email: user?.email ?? body.customer?.email,
      name: user?.name ?? body.customer?.name,
      phone: user?.phone ?? body.customer?.phone,
    },
    userId: user?.id,
    removeBranding: Boolean(body.removeBranding),
    referredBy: ref,
    couponCode: body.couponCode,
    couponDiscount: body.couponDiscount,
  });
  notifyNewOrder(order).catch(() => {});
  return NextResponse.json({ id: order.id, slug: order.slug });
}
