-- Run in Supabase SQL editor (safe to re-run).
-- Combines: shipments/envíos + delivery cycles from GitHub main.

-- ===== Envíos (local rework) =====
create table if not exists public.shipments (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  person_name text not null,
  normal integer not null default 0 check (normal >= 0),
  pepper integer not null default 0 check (pepper >= 0),
  spicy integer not null default 0 check (spicy >= 0),
  notes text,
  closed boolean not null default false,
  constraint shipments_has_packages check (normal + pepper + spicy > 0)
);

create table if not exists public.shipment_sales (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  shipment_id bigint not null references public.shipments (id) on delete cascade,
  quantity integer not null check (quantity > 0),
  paid boolean not null default false,
  sold_at date not null default current_date,
  notes text
);

create index if not exists shipment_sales_shipment_id_idx
  on public.shipment_sales (shipment_id);

-- ===== Ciclos de pedidos (from GitHub main) =====
create table if not exists public.delivery_cycles (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  is_open boolean not null default true
);

alter table public.delivery_clients
  add column if not exists cycle_id bigint references public.delivery_cycles (id);

-- ===== RLS =====
alter table public.shipments enable row level security;
alter table public.shipment_sales enable row level security;
alter table public.delivery_clients enable row level security;
alter table public.delivery_cycles enable row level security;

drop policy if exists "shipments_auth_all" on public.shipments;
create policy "shipments_auth_all"
  on public.shipments for all to authenticated
  using (true) with check (true);

drop policy if exists "shipment_sales_auth_all" on public.shipment_sales;
create policy "shipment_sales_auth_all"
  on public.shipment_sales for all to authenticated
  using (true) with check (true);

drop policy if exists "delivery_clients_auth_all" on public.delivery_clients;
create policy "delivery_clients_auth_all"
  on public.delivery_clients for all to authenticated
  using (true) with check (true);

-- Public pedidos: anyone can read open cycle + insert an order
drop policy if exists "cycles_public_read" on public.delivery_cycles;
create policy "cycles_public_read"
  on public.delivery_cycles for select
  to anon, authenticated
  using (true);

drop policy if exists "cycles_auth_write" on public.delivery_cycles;
create policy "cycles_auth_write"
  on public.delivery_cycles for all to authenticated
  using (true) with check (true);

drop policy if exists "delivery_clients_public_insert" on public.delivery_clients;
create policy "delivery_clients_public_insert"
  on public.delivery_clients for insert
  to anon, authenticated
  with check (true);

drop policy if exists "delivery_clients_public_select" on public.delivery_clients;
create policy "delivery_clients_public_select"
  on public.delivery_clients for select
  to anon, authenticated
  using (true);
