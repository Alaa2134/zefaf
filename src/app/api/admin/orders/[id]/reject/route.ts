import { NextResponse } from "next/server";
import { rejectOrder } from "@/lib/orders";
import { isAdmin } from "@/lib/admin";

export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  const { id } = await ctx.params;
  const o = await rejectOrder(id);
  if (!o) return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
