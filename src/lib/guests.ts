import { hasSupabase } from "./supabase";
import * as J from "./db/guests-json";
import type { Guest } from "./guests-types";
export type { Guest } from "./guests-types";

export async function listGuests(orderId: string): Promise<Guest[]> {
  if (hasSupabase()) {
    const { sb_listGuests } = await import("./db/guests-supabase");
    return sb_listGuests(orderId);
  }
  return J.json_listGuests(orderId);
}

export async function getGuestByToken(token: string): Promise<Guest | undefined> {
  if (hasSupabase()) {
    const { sb_getGuestByToken } = await import("./db/guests-supabase");
    return sb_getGuestByToken(token);
  }
  return J.json_getGuestByToken(token);
}

export async function addGuest(orderId: string, name: string, phone?: string): Promise<Guest> {
  if (hasSupabase()) {
    const { sb_addGuest } = await import("./db/guests-supabase");
    return sb_addGuest(orderId, name, phone);
  }
  return J.json_addGuest(orderId, name, phone);
}

export async function deleteGuest(id: string): Promise<void> {
  if (hasSupabase()) {
    const { sb_deleteGuest } = await import("./db/guests-supabase");
    return sb_deleteGuest(id);
  }
  return J.json_deleteGuest(id);
}

export async function markGuestOpened(token: string): Promise<void> {
  if (hasSupabase()) {
    const { sb_markGuestOpened } = await import("./db/guests-supabase");
    return sb_markGuestOpened(token);
  }
  return J.json_markGuestOpened(token);
}
