-- Public Storage bucket for artwork images, referenced by artworks.images[].path.
-- Reads are public (next/image needs unauthenticated access to the render
-- endpoint); writes happen only via the service-role key in scripts/seed-artworks.ts,
-- which bypasses Storage RLS entirely.

insert into storage.buckets (id, name, public)
values ('artworks', 'artworks', true)
on conflict (id) do nothing;
