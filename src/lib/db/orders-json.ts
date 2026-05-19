// JSON-file fallback (used when Supabase env vars are not set).
// Persists to /tmp on Vercel — will be wiped between deploys.
// Only meant for local dev or zero-config first run.

import fs from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";
import type { Order, RSVP } from "../orders-types";

const STORE_PATH = path.join("/tmp", "zefaf-orders.json");

function load(): Order[] {
  try {
    if (!fs.existsSync(STORE_PATH)) return [];
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function save(orders: Order[]) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(orders, null, 2));
}

export function json_listOrders(): Order[] {
  return load().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function json_getOrder(id: string): Order | undefined {
  return load().find((o) => o.id === id);
}

export function json_getOrderBySlug(slug: string): Order | undefined {
  return load().find((o) => o.slug === slug);
}

export function json_createOrder(input: Omit<Order, "id" | "slug" | "createdAt" | "status" | "rsvps" | "views">): Order {
  const orders = load();
  const order: Order = {
    ...input,
    id: nanoid(10),
    slug: nanoid(8).toLowerCase(),
    createdAt: new Date().toISOString(),
    status: "pending_payment",
    rsvps: [],
    views: 0,
  };
  orders.push(order);
  save(orders);
  return order;
}

export function json_updateOrder(id: string, patch: Partial<Order>): Order | undefined {
  const orders = load();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx < 0) return undefined;
  orders[idx] = { ...orders[idx], ...patch };
  save(orders);
  return orders[idx];
}

export function json_addRsvp(slug: string, rsvp: Omit<RSVP, "id" | "createdAt">): Order | undefined {
  const orders = load();
  const idx = orders.findIndex((o) => o.slug === slug);
  if (idx < 0) return undefined;
  orders[idx].rsvps.push({
    ...rsvp,
    id: nanoid(6),
    createdAt: new Date().toISOString(),
  });
  save(orders);
  return orders[idx];
}

export function json_incrementViews(slug: string): void {
  const orders = load();
  const idx = orders.findIndex((o) => o.slug === slug);
  if (idx < 0) return;
  orders[idx].views = (orders[idx].views || 0) + 1;
  save(orders);
}

export function json_getStats() {
  const orders = load();
  const paid = orders.filter((o) => o.status === "paid");
  const pending = orders.filter((o) => o.status === "pending_review");
  const revenue = paid.reduce((sum, o) => sum + o.price, 0);
  return {
    totalOrders: orders.length,
    paidOrders: paid.length,
    pendingOrders: pending.length,
    revenue,
    activeInvitations: paid.length,
    totalRsvps: orders.reduce((s, o) => s + o.rsvps.length, 0),
  };
}
