import { nanoid } from "nanoid";
import { supabaseAdmin } from "../supabase";
import type { Guest } from "../guests-types";

interface Row {
  id: string;
  order_id: string;
  name: string;
  phone: string | null;
  token: string;
  opened_at: string | null;
  rsvp_id: string | null;
  created_at: string;
}

function fromRow(r: Row): Guest {
  return {
    id: r.id,
    orderId: r.order_id,
    name: r.name,
    phone: r.phone ?? undefined,
    token: r.token,
    openedAt: r.opened_at ?? undefined,
    rsvpId: r.rsvp_id ?? undefined,
    createdAt: r.created_at,
  };
}

export async function sb_listGuests(orderId: string): Promise<Guest[]> {
  const sb = supabaseAdmin();
  const { data } = await sb.from("guests").select("*").eq("order_id", orderId).order("created_at");
  return (data ?? []).map((r) => fromRow(r as Row));
}

export async function sb_getGuestByToken(token: string): Promise<Guest | undefined> {
  const sb = supabaseAdmin();
  const { data } = await sb.from("guests").select("*").eq("token", token).maybeSingle();
  return data ? fromRow(data as Row) : undefined;
}

export async function sb_addGuest(orderId: string, name: string, phone?: string): Promise<Guest> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("guests")
    .insert({
      id: nanoid(8),
      order_id: orderId,
      name,
      phone,
      token: nanoid(10).toLowerCase(),
    })
    .select()
    .single();
  if (error) throw error;
  return fromRow(data as Row);
}

export async function sb_deleteGuest(id: string): Promise<void> {
  const sb = supabaseAdmin();
  await sb.from("guests").delete().eq("id", id);
}

export async function sb_markGuestOpened(token: string): Promise<void> {
  const sb = supabaseAdmin();
  await sb.from("guests").update({ opened_at: new Date().toISOString() }).eq("token", token).is("opened_at", null);
}
