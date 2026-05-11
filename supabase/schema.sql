-- Founders table: lifetime access for Cartografa completers
create table founders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  stripe_customer_id text not null unique,
  license_key text not null unique,
  claimed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Extend auth.users with founder flag
alter table auth.users add column is_founder boolean default false;

-- Optional: indexes for performance
create index idx_founders_license_key on founders(license_key);
create index idx_founders_user_id on founders(user_id);