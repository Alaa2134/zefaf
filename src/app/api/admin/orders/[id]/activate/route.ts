import { NextResponse } from "next/server";
import { activateOrder } from "@/lib/orders";
import { isAdmin } from "@/lib/admin";
import { notifyOrderActivated } from "@/lib/notify";

export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  const { id } = await ctx.params;
  const o = await activateOrder(id);
  if (!o) return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  notifyOrderActivated(o).catch(() => {});
  return NextResponse.json({ ok: true, slug: o.slug });
}
