import fs from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";
import type { Guest } from "../guests-types";

const STORE = path.join("/tmp", "zefaf-guests.json");

function load(): Guest[] {
  try {
    if (!fs.existsSync(STORE)) return [];
    return JSON.parse(fs.readFileSync(STORE, "utf-8"));
  } catch {
    return [];
  }
}

function save(guests: Guest[]) {
  fs.writeFileSync(STORE, JSON.stringify(guests, null, 2));
}

export function json_listGuests(orderId: string): Guest[] {
  return load().filter((g) => g.orderId === orderId);
}

export function json_getGuestByToken(token: string): Guest | undefined {
  return load().find((g) => g.token === token);
}

export function json_addGuest(orderId: string, name: string, phone?: string): Guest {
  const guests = load();
  const guest: Guest = {
    id: nanoid(8),
    orderId,
    name,
    phone,
    token: nanoid(10).toLowerCase(),
    createdAt: new Date().toISOString(),
  };
  guests.push(guest);
  save(guests);
  return guest;
}

export function json_deleteGuest(id: string): void {
  save(load().filter((g) => g.id !== id));
}

export function json_markGuestOpened(token: string): void {
  const guests = load();
  const idx = guests.findIndex((g) => g.token === token);
  if (idx < 0 || guests[idx].openedAt) return;
  guests[idx].openedAt = new Date().toISOString();
  save(guests);
}
