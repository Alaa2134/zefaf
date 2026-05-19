import { nanoid } from "nanoid";
import { supabaseAdmin, uploadDataUrl } from "../supabase";
import type { Order, RSVP, OrderStatus } from "../orders-types";

interface OrderRow {
  id: string;
  slug: string;
  template_id: string;
  tier: string | null;
  created_at: string;
  status: OrderStatus;
  price: number;
  remove_branding: boolean;
  referred_by: string | null;
  coupon_code: string | null;
  coupon_discount: number | null;
  invitation: Order["invitation"];
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  receipt_method: "vodafone_cash" | "instapay" | null;
  receipt_image_url: string | null;
  receipt_note: string | null;
  receipt_uploaded_at: string | null;
  views: number;
}

function fromRow(row: OrderRow, rsvps: RSVP[] = []): Order {
  return {
    id: row.id,
    slug: row.slug,
    templateId: row.template_id,
    tier: (row.tier as Order["tier"]) ?? "basic",
    createdAt: row.created_at,
    status: row.status,
    price: row.price,
    removeBranding: row.remove_branding,
    referredBy: row.referred_by ?? undefined,
    couponCode: row.coupon_code ?? undefined,
    couponDiscount: row.coupon_discount ?? undefined,
    invitation: row.invitation,
    customer: {
      name: row.customer_name ?? undefined,
      phone: row.customer_phone ?? undefined,
      email: row.customer_email ?? undefined,
    },
    receipt: row.receipt_method
      ? {
          method: row.receipt_method,
          image: row.receipt_image_url ?? undefined,
          note: row.receipt_note ?? undefined,
          uploadedAt: row.receipt_uploaded_at ?? new Date().toISOString(),
        }
      : undefined,
    rsvps,
    views: row.views,
  };
}

export async function sb_listOrders(): Promise<Order[]> {
  const sb = supabaseAdmin();
  const { data: orders, error } = await sb
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!orders || orders.length === 0) return [];

  const { data: rsvps } = await sb.from("rsvps").select("*");
  const byOrder = new Map<string, RSVP[]>();
  (rsvps ?? []).forEach((r: any) => {
    const list = byOrder.get(r.order_id) ?? [];
    list.push({
      id: r.id,
      name: r.name,
      phone: r.phone ?? undefined,
      attending: r.attending,
      guests: r.guests,
      message: r.message ?? undefined,
      createdAt: r.created_at,
    });
    byOrder.set(r.order_id, list);
  });

  return (orders as OrderRow[]).map((row) => fromRow(row, byOrder.get(row.id) ?? []));
}

export async function sb_getOrder(id: string): Promise<Order | undefined> {
  const sb = supabaseAdmin();
  const { data, error } = await sb.from("orders").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return undefined;
  const { data: rsvps } = await sb.from("rsvps").select("*").eq("order_id", id);
  return fromRow(data as OrderRow, (rsvps ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    phone: r.phone ?? undefined,
    attending: r.attending,
    guests: r.guests,
    message: r.message ?? undefined,
    createdAt: r.created_at,
  })));
}

export async function sb_getOrderBySlug(slug: string): Promise<Order | undefined> {
  const sb = supabaseAdmin();
  const { data, error } = await sb.from("orders").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!data) return undefined;
  const { data: rsvps } = await sb.from("rsvps").select("*").eq("order_id", data.id);
  return fromRow(data as OrderRow, (rsvps ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    phone: r.phone ?? undefined,
    attending: r.attending,
    guests: r.guests,
    message: r.message ?? undefined,
    createdAt: r.created_at,
  })));
}

export async function sb_createOrder(input: Omit<Order, "id" | "slug" | "createdAt" | "status" | "rsvps" | "views">): Promise<Order> {
  const sb = supabaseAdmin();
  const id = nanoid(10);
  const slug = nanoid(8).toLowerCase();

  // Upload photos from base64 to storage so they're not bloating the DB
  const invitation = { ...input.invitation };
  for (const k of ["groomPhoto", "bridePhoto", "couplePhoto"] as const) {
    const v = invitation[k];
    if (v && v.startsWith("data:")) {
      try {
        invitation[k] = await uploadDataUrl(v, "photos");
      } catch (e) {
        console.error("Failed to upload photo", k, e);
      }
    }
  }

  const { data, error } = await sb
    .from("orders")
    .insert({
      id,
      slug,
      template_id: input.templateId,
      tier: input.tier ?? "basic",
      status: "pending_payment",
      price: input.price,
      remove_branding: input.removeBranding ?? false,
      referred_by: input.referredBy ?? null,
      coupon_code: input.couponCode ?? null,
      coupon_discount: input.couponDiscount ?? null,
      invitation,
      customer_name: input.customer?.name,
      customer_phone: input.customer?.phone,
      customer_email: input.customer?.email,
      views: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return fromRow(data as OrderRow, []);
}

export async function sb_updateOrder(id: string, patch: Partial<Order>): Promise<Order | undefined> {
  const sb = supabaseAdmin();
  const update: Record<string, unknown> = {};
  if (patch.status) update.status = patch.status;
  if (patch.removeBranding !== undefined) update.remove_branding = patch.removeBranding;
  if (patch.customer) {
    if (patch.customer.name !== undefined) update.customer_name = patch.customer.name;
    if (patch.customer.phone !== undefined) update.customer_phone = patch.customer.phone;
    if (patch.customer.email !== undefined) update.customer_email = patch.customer.email;
  }
  if (patch.receipt) {
    update.receipt_method = patch.receipt.method;
    if (patch.receipt.image) {
      // Upload receipt image to storage if it's still a data URL
      if (patch.receipt.image.startsWith("data:")) {
        try {
          update.receipt_image_url = await uploadDataUrl(patch.receipt.image, "receipts");
        } catch (e) {
          console.error("Failed to upload receipt", e);
          update.receipt_image_url = null;
        }
      } else {
        update.receipt_image_url = patch.receipt.image;
      }
    }
    update.receipt_note = patch.receipt.note;
    update.receipt_uploaded_at = patch.receipt.uploadedAt;
  }

  const { data, error } = await sb.from("orders").update(update).eq("id", id).select().single();
  if (error) throw error;
  return fromRow(data as OrderRow, []);
}

export async function sb_addRsvp(slug: string, rsvp: Omit<RSVP, "id" | "createdAt">): Promise<Order | undefined> {
  const sb = supabaseAdmin();
  const order = await sb_getOrderBySlug(slug);
  if (!order) return undefined;
  const { error } = await sb.from("rsvps").insert({
    id: nanoid(8),
    order_id: order.id,
    name: rsvp.name,
    phone: rsvp.phone,
    attending: rsvp.attending,
    guests: rsvp.guests,
    message: rsvp.message,
  });
  if (error) throw error;
  return sb_getOrderBySlug(slug);
}

export async function sb_incrementViews(slug: string): Promise<void> {
  const sb = supabaseAdmin();
  await sb.rpc("increment_views", { slug_in: slug });
}

export async function sb_getStats() {
  const orders = await sb_listOrders();
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
