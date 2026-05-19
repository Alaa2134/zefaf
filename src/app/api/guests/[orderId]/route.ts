import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { listGuests, addGuest } from "@/lib/guests";

export async function GET(_: NextRequest, ctx: { params: Promise<{ orderId: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { orderId } = await ctx.params;
  const guests = await listGuests(orderId);
  return NextResponse.json({ guests });
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ orderId: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { orderId } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  if (!body?.name) return NextResponse.json({ error: "اسم الضيف مطلوب" }, { status: 400 });
  const guest = await addGuest(orderId, String(body.name), body.phone ? String(body.phone) : undefined);
  return NextResponse.json({ guest });
}
