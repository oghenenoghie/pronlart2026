-- Core catalogue schema: artists, movements, mediums, artworks, exhibitions,
-- enquiries, sell submissions, posts, and the profiles table used for RLS.

create extension if not exists pg_trgm;

create type artwork_status as enum ('available', 'reserved', 'sold');
create type artist_status as enum ('active', 'archived');
create type enquiry_type as enum ('purchase', 'enquiry', 'sell');
create type enquiry_status as enum ('open', 'responded', 'closed');
create type sell_submission_status as enum ('pending', 'accepted', 'declined');
create type profile_role as enum ('user', 'admin');

create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles ------------------------------------------------------------------
-- One row per auth.users id; role drives RLS admin checks.

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role profile_role not null default 'user',
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Artists ---------------------------------------------------------------

create table artists (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  portrait text,
  statement text,
  bio text,
  links jsonb not null default '{}'::jsonb,
  status artist_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger artists_set_updated_at
  before update on artists
  for each row execute function set_updated_at();

-- Movements ---------------------------------------------------------------

create table movements (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  era text not null,
  summary text not null,
  blurb text not null,
  hero_image text,
  sort smallint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger movements_set_updated_at
  before update on movements
  for each row execute function set_updated_at();

-- Mediums ---------------------------------------------------------------

create table mediums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null
);

-- Artworks ---------------------------------------------------------------

create table artworks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  artist_id uuid not null references artists (id) on delete restrict,
  movement_id uuid not null references movements (id) on delete restrict,
  medium_id uuid not null references mediums (id) on delete restrict,
  year smallint not null,
  dimensions text not null,
  materials text not null,
  description text not null default '',
  -- integer minor units; null = price on request
  price bigint,
  currency text not null default 'NGN',
  edition text,
  status artwork_status not null default 'available',
  images jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint artworks_price_non_negative check (price is null or price >= 0)
);

create trigger artworks_set_updated_at
  before update on artworks
  for each row execute function set_updated_at();

create index artworks_artist_id_idx on artworks (artist_id);
create index artworks_movement_id_idx on artworks (movement_id);
create index artworks_medium_id_idx on artworks (medium_id);
create index artworks_status_idx on artworks (status);
create index artworks_featured_idx on artworks (featured) where featured;

create index artworks_title_trgm_idx on artworks using gin (title gin_trgm_ops);
create index artworks_materials_trgm_idx on artworks using gin (materials gin_trgm_ops);

-- Exhibitions ---------------------------------------------------------------

create table exhibitions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  curator_note text,
  artwork_ids uuid[] not null default '{}',
  hero_image text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger exhibitions_set_updated_at
  before update on exhibitions
  for each row execute function set_updated_at();

-- Enquiries / orders ---------------------------------------------------------------

create table enquiries (
  id uuid primary key default gen_random_uuid(),
  type enquiry_type not null,
  artwork_id uuid references artworks (id) on delete set null,
  name text not null,
  email text not null,
  message text,
  -- integer minor units; only meaningful for an offer against a POA work
  offer bigint,
  attachments jsonb not null default '[]'::jsonb,
  status enquiry_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint enquiries_offer_non_negative check (offer is null or offer >= 0)
);

create trigger enquiries_set_updated_at
  before update on enquiries
  for each row execute function set_updated_at();

create index enquiries_artwork_id_idx on enquiries (artwork_id);
create index enquiries_status_idx on enquiries (status);

-- Sell submissions ---------------------------------------------------------------

create table sell_submissions (
  id uuid primary key default gen_random_uuid(),
  artist_name text not null,
  artist_email text not null,
  title text not null,
  movement_id uuid references movements (id) on delete set null,
  medium_id uuid references mediums (id) on delete set null,
  dimensions text not null,
  asking_price bigint,
  currency text not null default 'NGN',
  images jsonb not null default '[]'::jsonb,
  message text,
  status sell_submission_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sell_submissions_asking_price_non_negative check (asking_price is null or asking_price >= 0)
);

create trigger sell_submissions_set_updated_at
  before update on sell_submissions
  for each row execute function set_updated_at();

create index sell_submissions_status_idx on sell_submissions (status);

-- Posts (journal / archive writing) ---------------------------------------------------------------

create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  cover text,
  body text not null default '',
  tags text[] not null default '{}',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger posts_set_updated_at
  before update on posts
  for each row execute function set_updated_at();

create index posts_published_at_idx on posts (published_at);
