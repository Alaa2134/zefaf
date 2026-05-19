import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { deleteGuest } from "@/lib/guests";

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  await deleteGuest(id);
  return NextResponse.json({ ok: true });
}
