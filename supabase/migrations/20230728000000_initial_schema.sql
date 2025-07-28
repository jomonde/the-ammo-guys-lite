-- Enable extensions
create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "pgcrypto" with schema extensions;

-- Create enum types
create type subscription_status as enum ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid');
create type subscription_event_type as enum ('created', 'updated', 'canceled', 'renewed', 'payment_failed', 'payment_succeeded');
create type ammo_type as enum ('FMJ', 'JHP', 'HP', 'SP', 'AP', 'Tracer', 'Other');

-- Create tables
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null unique,
  first_name text,
  last_name text,
  stripe_customer_id text unique,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_subscription_id text not null unique,
  status subscription_status not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table public.subscription_items (
  id uuid primary key default uuid_generate_v4(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  stripe_price_id text not null,
  quantity integer not null default 1,
  created_at timestamptz default now() not null
);

create table public.ammo_inventory (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  caliber text not null,
  type ammo_type not null,
  price_per_round numeric(10, 2) not null,
  quantity_in_stock integer not null default 0,
  created_at timestamptz default now() not null
);

-- Create indexes
create index idx_profiles_email on public.profiles(email);
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscription_items_subscription_id on public.subscription_items(subscription_id);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.subscription_items enable row level security;
alter table public.ammo_inventory enable row level security;

-- Profiles
create policy "Users can manage their own profile"
on public.profiles for all
using (auth.uid() = id);

-- Subscriptions
create policy "Users can view their subscriptions"
on public.subscriptions for select
using (auth.uid() = user_id);

-- Subscription Items
create policy "Users can view their subscription items"
on public.subscription_items for select
using (exists (select 1 from public.subscriptions where id = subscription_id and user_id = auth.uid()));

-- Ammo Inventory
create policy "Public ammo inventory is viewable"
on public.ammo_inventory for select
to authenticated, anon
using (true);

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at
before update on public.profiles
for each row execute function public.handle_updated_at();

-- New user handler
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
