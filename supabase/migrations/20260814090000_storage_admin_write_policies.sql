-- The seed scripts write via the service-role key, which bypasses Storage RLS
-- entirely. The admin dashboard uploads from the browser under the signed-in
-- admin's own session instead, so it needs its own Storage policies.

create policy "artworks bucket admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'artworks' and public.is_admin());

create policy "artworks bucket admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'artworks' and public.is_admin())
  with check (bucket_id = 'artworks' and public.is_admin());

create policy "artworks bucket admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'artworks' and public.is_admin());
