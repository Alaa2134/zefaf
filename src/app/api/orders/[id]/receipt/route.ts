import { NextRequest, NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/orders";
import { notifyReceiptUploaded } from "@/lib/notify";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const order = await getOrder(id);
  if (!order) return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  const body = await req.json();
  const updated = await updateOrder(id, {
    receipt: {
      method: body.method ?? "vodafone_cash",
      image: body.image,
      note: body.note,
      uploadedAt: new Date().toISOString(),
    },
    customer: { ...order.customer, name: body.name, phone: body.phone },
    status: "pending_review",
  });
  if (updated) notifyReceiptUploaded(updated).catch(() => {});
  return NextResponse.json({ ok: true, order: updated });
}
