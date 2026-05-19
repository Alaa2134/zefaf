import { NextRequest, NextResponse } from "next/server";
import { addRsvp } from "@/lib/orders";

export async function POST(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const body = await req.json();
  if (!body?.name || typeof body.attending !== "boolean") {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }
  const order = await addRsvp(slug, {
    name: body.name,
    phone: body.phone,
    attending: body.attending,
    guests: body.guests ?? 1,
    message: body.message,
  });
  if (!order) return NextResponse.json({ error: "الدعوة غير موجودة" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
