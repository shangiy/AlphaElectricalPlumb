-- =========================================================
-- Alpha Electricals & Plumbing Ltd — Initial Schema
-- Products with variants (size/spec-level price & stock)
-- =========================================================

-- ---------- Categories ----------
create table categories (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique,
  created_at   timestamptz not null default now()
);

-- ---------- Products ----------
-- Holds shared/descriptive info. Price and stock live on variants.
create table products (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid references categories(id) on delete set null,
  name          text not null,
  slug          text not null unique,
  description   text,
  brand         text,
  image_url     text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_products_category on products(category_id);

-- ---------- Product Variants ----------
-- One row per size/spec (e.g. "20mm", "1.5 HP", "5kg bag").
-- This is where price and stock actually live.
create table product_variants (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references products(id) on delete cascade,
  spec_label     text not null,              -- e.g. "20mm", "50kg", "1.5HP"
  sku            text unique,
  price          numeric(10,2) not null check (price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (product_id, spec_label)
);

create index idx_variants_product on product_variants(product_id);

-- ---------- Profiles ----------
-- One row per authenticated user, linked 1:1 to Supabase Auth.
create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  phone        text,
  address      text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------- Reviews ----------
-- Reviews are per product (not per variant) so ratings aggregate cleanly.
create table reviews (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references products(id) on delete cascade,
  user_id      uuid not null references profiles(id) on delete cascade,
  rating       smallint not null check (rating between 1 and 5),
  comment      text,
  created_at   timestamptz not null default now(),
  unique (product_id, user_id)   -- one review per user per product
);

create index idx_reviews_product on reviews(product_id);

-- ---------- Orders ----------
create type order_status as enum ('pending', 'confirmed', 'shipped', 'completed', 'cancelled');

create table orders (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references profiles(id) on delete restrict,
  status         order_status not null default 'pending',
  total_amount   numeric(10,2) not null default 0 check (total_amount >= 0),
  shipping_address text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index idx_orders_user on orders(user_id);

-- ---------- Order Items ----------
-- Snapshot of variant + price at time of purchase, so later price
-- changes never rewrite historical order totals.
create table order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  variant_id    uuid not null references product_variants(id) on delete restrict,
  quantity      integer not null check (quantity > 0),
  unit_price    numeric(10,2) not null check (unit_price >= 0),
  created_at    timestamptz not null default now()
);

create index idx_order_items_order on order_items(order_id);
create index idx_order_items_variant on order_items(variant_id);

-- =========================================================
-- Keep updated_at fresh automatically on row updates
-- =========================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_products_updated_at before update on products
  for each row execute function set_updated_at();

create trigger trg_variants_updated_at before update on product_variants
  for each row execute function set_updated_at();

create trigger trg_profiles_updated_at before update on profiles
  for each row execute function set_updated_at();

create trigger trg_orders_updated_at before update on orders
  for each row execute function set_updated_at();