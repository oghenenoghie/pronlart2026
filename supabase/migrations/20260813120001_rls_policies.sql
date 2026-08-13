-- Row-level security: public read of published catalogue content, admin-only
-- writes, insert-only public access for enquiries and sell submissions.

create function is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

alter table profiles enable row level security;
alter table artists enable row level security;
alter table movements enable row level security;
alter table mediums enable row level security;
alter table artworks enable row level security;
alter table exhibitions enable row level security;
alter table enquiries enable row level security;
alter table sell_submissions enable row level security;
alter table posts enable row level security;

-- Profiles: a user can see and update their own row; admins see everyone.

create policy "profiles read own or admin" on profiles
  for select using (auth.uid() = id or is_admin());

create policy "profiles update own" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "profiles admin write" on profiles
  for all using (is_admin()) with check (is_admin());

-- Artists: public read of active artists; admin full access.

create policy "artists public read" on artists
  for select using (status = 'active' or is_admin());

create policy "artists admin write" on artists
  for insert with check (is_admin());
create policy "artists admin update" on artists
  for update using (is_admin()) with check (is_admin());
create policy "artists admin delete" on artists
  for delete using (is_admin());

-- Movements: fully public read (taxonomy), admin write.

create policy "movements public read" on movements
  for select using (true);
create policy "movements admin write" on movements
  for insert with check (is_admin());
create policy "movements admin update" on movements
  for update using (is_admin()) with check (is_admin());
create policy "movements admin delete" on movements
  for delete using (is_admin());

-- Mediums: fully public read (taxonomy), admin write.

create policy "mediums public read" on mediums
  for select using (true);
create policy "mediums admin write" on mediums
  for insert with check (is_admin());
create policy "mediums admin update" on mediums
  for update using (is_admin()) with check (is_admin());
create policy "mediums admin delete" on mediums
  for delete using (is_admin());

-- Artworks: public read; admin write.

create policy "artworks public read" on artworks
  for select using (true);
create policy "artworks admin write" on artworks
  for insert with check (is_admin());
create policy "artworks admin update" on artworks
  for update using (is_admin()) with check (is_admin());
create policy "artworks admin delete" on artworks
  for delete using (is_admin());

-- Exhibitions: public read once published; admin sees and writes everything.

create policy "exhibitions public read" on exhibitions
  for select using (published_at is not null and published_at <= now() or is_admin());
create policy "exhibitions admin write" on exhibitions
  for insert with check (is_admin());
create policy "exhibitions admin update" on exhibitions
  for update using (is_admin()) with check (is_admin());
create policy "exhibitions admin delete" on exhibitions
  for delete using (is_admin());

-- Enquiries: anyone can submit; only admins can read or manage them.

create policy "enquiries public insert" on enquiries
  for insert with check (true);
create policy "enquiries admin read" on enquiries
  for select using (is_admin());
create policy "enquiries admin update" on enquiries
  for update using (is_admin()) with check (is_admin());
create policy "enquiries admin delete" on enquiries
  for delete using (is_admin());

-- Sell submissions: anyone can submit; only admins can read or manage them.

create policy "sell_submissions public insert" on sell_submissions
  for insert with check (true);
create policy "sell_submissions admin read" on sell_submissions
  for select using (is_admin());
create policy "sell_submissions admin update" on sell_submissions
  for update using (is_admin()) with check (is_admin());
create policy "sell_submissions admin delete" on sell_submissions
  for delete using (is_admin());

-- Posts: public read once published; admin sees and writes everything.

create policy "posts public read" on posts
  for select using (published_at is not null and published_at <= now() or is_admin());
create policy "posts admin write" on posts
  for insert with check (is_admin());
create policy "posts admin update" on posts
  for update using (is_admin()) with check (is_admin());
create policy "posts admin delete" on posts
  for delete using (is_admin());
