import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body?.templateId || !body?.invitation || !body?.price) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }
  const order = createOrder({
    templateId: body.templateId,
    price: body.price,
    invitation: body.invitation,
    customer: body.customer ?? {},
    removeBranding: Boolean(body.removeBranding),
  });
  return NextResponse.json({ id: order.id, slug: order.slug });
}
