-- ============================================================
-- Zefaf — Supabase schema
-- Run this once in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Storage bucket for receipts + couple photos (public read, authenticated write)
insert into storage.buckets (id, name, public)
values ('zefaf-uploads', 'zefaf-uploads', true)
on conflict (id) do nothing;

-- ============================================================
-- ORDERS table
-- ============================================================
create table if not exists public.orders (
  id text primary key,
  slug text unique not null,
  template_id text not null,
  created_at timestamptz default now() not null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'pending_review', 'paid', 'rejected')),
  price integer not null,
  remove_branding boolean default false not null,

  -- Invitation content (JSONB for flexibility)
  invitation jsonb not null,

  -- Customer info
  customer_name text,
  customer_phone text,
  customer_email text,

  -- Receipt info
  receipt_method text check (receipt_method in ('vodafone_cash', 'instapay')),
  receipt_image_url text,
  receipt_note text,
  receipt_uploaded_at timestamptz,

  views integer default 0 not null
);

create index if not exists orders_slug_idx on public.orders (slug);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- ============================================================
-- RSVPS table
-- ============================================================
create table if not exists public.rsvps (
  id text primary key,
  order_id text references public.orders(id) on delete cascade not null,
  name text not null,
  phone text,
  attending boolean not null,
  guests integer default 1 not null,
  message text,
  created_at timestamptz default now() not null
);

create index if not exists rsvps_order_id_idx on public.rsvps (order_id);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.orders enable row level security;
alter table public.rsvps enable row level security;

-- Public can read paid orders by slug only (for invitation page)
drop policy if exists "Public reads paid orders by slug" on public.orders;
create policy "Public reads paid orders by slug"
  on public.orders for select
  using (status = 'paid');

-- Public can insert RSVPs to any paid order
drop policy if exists "Public can RSVP to paid orders" on public.rsvps;
create policy "Public can RSVP to paid orders"
  on public.rsvps for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.status = 'paid'
    )
  );

-- Public can read RSVPs for paid orders (for guest count display)
drop policy if exists "Public reads RSVPs for paid orders" on public.rsvps;
create policy "Public reads RSVPs for paid orders"
  on public.rsvps for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.status = 'paid'
    )
  );

-- ============================================================
-- Storage policies (public read, public upload for receipts/photos)
-- ============================================================
drop policy if exists "Anyone can read uploads" on storage.objects;
create policy "Anyone can read uploads"
  on storage.objects for select
  using (bucket_id = 'zefaf-uploads');

drop policy if exists "Anyone can upload" on storage.objects;
create policy "Anyone can upload"
  on storage.objects for insert
  with check (bucket_id = 'zefaf-uploads');

-- ============================================================
-- Helper: increment view counter atomically
-- ============================================================
create or replace function public.increment_views(slug_in text)
returns void
language plpgsql
security definer
as $$
begin
  update public.orders set views = views + 1 where slug = slug_in;
end;
$$;
