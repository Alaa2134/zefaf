// In-memory store for MVP. In production swap with Supabase tables.
// Persists to a JSON file in /tmp so dev refreshes don't wipe orders.

import fs from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";

export type OrderStatus = "pending_payment" | "pending_review" | "paid" | "rejected";

export interface Order {
  id: string;
  slug: string; // invitation public slug
  templateId: string;
  createdAt: string;
  status: OrderStatus;
  price: number;
  invitation: {
    groomName: string;
    brideName: string;
    date: string;
    venue: string;
    time: string;
    message: string;
    groomPhoto?: string;
    bridePhoto?: string;
    couplePhoto?: string;
    enableMusic: boolean;
    musicChoice: string;
  };
  removeBranding?: boolean; // +300 EGP upgrade — hides "صُنع بواسطة زفاف" footer
  customer: {
    name?: string;
    phone?: string;
    email?: string;
  };
  receipt?: {
    method: "vodafone_cash" | "instapay";
    image?: string;
    note?: string;
    uploadedAt: string;
  };
  rsvps: RSVP[];
  views: number;
}

export interface RSVP {
  id: string;
  name: string;
  phone?: string;
  attending: boolean;
  guests: number;
  message?: string;
  createdAt: string;
}

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

export function listOrders(): Order[] {
  return load().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getOrder(id: string): Order | undefined {
  return load().find((o) => o.id === id);
}

export function getOrderBySlug(slug: string): Order | undefined {
  return load().find((o) => o.slug === slug);
}

export function createOrder(input: Omit<Order, "id" | "slug" | "createdAt" | "status" | "rsvps" | "views">): Order {
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

export function updateOrder(id: string, patch: Partial<Order>): Order | undefined {
  const orders = load();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx < 0) return undefined;
  orders[idx] = { ...orders[idx], ...patch };
  save(orders);
  return orders[idx];
}

export function activateOrder(id: string): Order | undefined {
  return updateOrder(id, { status: "paid" });
}

export function rejectOrder(id: string): Order | undefined {
  return updateOrder(id, { status: "rejected" });
}

export function addRsvp(slug: string, rsvp: Omit<RSVP, "id" | "createdAt">): Order | undefined {
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

export function incrementViews(slug: string): void {
  const orders = load();
  const idx = orders.findIndex((o) => o.slug === slug);
  if (idx < 0) return;
  orders[idx].views = (orders[idx].views || 0) + 1;
  save(orders);
}

export function getStats() {
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
