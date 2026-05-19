// Unified orders interface — uses Supabase if configured, falls back to JSON file.
// All callers should `await` these functions.

import { hasSupabase } from "./supabase";
import {
  json_listOrders,
  json_getOrder,
  json_getOrderBySlug,
  json_createOrder,
  json_updateOrder,
  json_addRsvp,
  json_incrementViews,
  json_getStats,
} from "./db/orders-json";
import type { Order, RSVP } from "./orders-types";

export type { Order, RSVP, OrderStatus } from "./orders-types";

export async function listOrders(): Promise<Order[]> {
  if (hasSupabase()) {
    const { sb_listOrders } = await import("./db/orders-supabase");
    return sb_listOrders();
  }
  return json_listOrders();
}

export async function getOrder(id: string): Promise<Order | undefined> {
  if (hasSupabase()) {
    const { sb_getOrder } = await import("./db/orders-supabase");
    return sb_getOrder(id);
  }
  return json_getOrder(id);
}

export async function getOrderBySlug(slug: string): Promise<Order | undefined> {
  if (hasSupabase()) {
    const { sb_getOrderBySlug } = await import("./db/orders-supabase");
    return sb_getOrderBySlug(slug);
  }
  return json_getOrderBySlug(slug);
}

export async function createOrder(input: Omit<Order, "id" | "slug" | "createdAt" | "status" | "rsvps" | "views">): Promise<Order> {
  if (hasSupabase()) {
    const { sb_createOrder } = await import("./db/orders-supabase");
    return sb_createOrder(input);
  }
  return json_createOrder(input);
}

export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | undefined> {
  if (hasSupabase()) {
    const { sb_updateOrder } = await import("./db/orders-supabase");
    return sb_updateOrder(id, patch);
  }
  return json_updateOrder(id, patch);
}

export async function activateOrder(id: string): Promise<Order | undefined> {
  return updateOrder(id, { status: "paid" });
}

export async function rejectOrder(id: string): Promise<Order | undefined> {
  return updateOrder(id, { status: "rejected" });
}

export async function addRsvp(slug: string, rsvp: Omit<RSVP, "id" | "createdAt">): Promise<Order | undefined> {
  if (hasSupabase()) {
    const { sb_addRsvp } = await import("./db/orders-supabase");
    return sb_addRsvp(slug, rsvp);
  }
  return json_addRsvp(slug, rsvp);
}

export async function incrementViews(slug: string): Promise<void> {
  if (hasSupabase()) {
    const { sb_incrementViews } = await import("./db/orders-supabase");
    return sb_incrementViews(slug);
  }
  return json_incrementViews(slug);
}

export async function getStats() {
  if (hasSupabase()) {
    const { sb_getStats } = await import("./db/orders-supabase");
    return sb_getStats();
  }
  return json_getStats();
}
