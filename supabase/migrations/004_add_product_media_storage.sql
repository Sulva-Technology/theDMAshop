insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Public can view product media" on storage.objects;
create policy "Public can view product media"
on storage.objects for select
using (bucket_id = 'product-media');

drop policy if exists "Admins can upload product media" on storage.objects;
create policy "Admins can upload product media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'product-media'
  and public.is_admin()
);

drop policy if exists "Admins can update product media" on storage.objects;
create policy "Admins can update product media"
on storage.objects for update
to authenticated
using (
  bucket_id = 'product-media'
  and public.is_admin()
)
with check (
  bucket_id = 'product-media'
  and public.is_admin()
);

drop policy if exists "Admins can delete product media" on storage.objects;
create policy "Admins can delete product media"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'product-media'
  and public.is_admin()
);
