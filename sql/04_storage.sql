/* =========================================================
   STORAGE SETUP (Buckets + Policies)
========================================================= */

-- =========================================================
-- 1. CREATE BUCKETS
-- =========================================================

insert into storage.buckets (id, name, public, allowed_mime_types)
values 
  (
    'cover-art', 
    'cover-art', 
    true, 
    array['image/*']
  ),
  (
    'music', 
    'music', 
    true, 
    array['audio/*']
  )
on conflict (id) do nothing;


-- =========================================================
-- 3. POLICIES
-- =========================================================

-- ---------------------------------------------------------
-- PUBLIC READ (since buckets are public)
-- ---------------------------------------------------------

create policy "Public read cover-art"
on storage.objects for select
using (bucket_id = 'cover-art');

create policy "Public read music"
on storage.objects for select
using (bucket_id = 'music');


-- ---------------------------------------------------------
-- AUTHENTICATED WRITE ACCESS
-- ---------------------------------------------------------

-- Cover Art
create policy "Authenticated upload cover-art"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'cover-art'
  and auth.role() = 'authenticated'
);

create policy "Authenticated update cover-art"
on storage.objects for update
to authenticated
using (
  bucket_id = 'cover-art'
  and auth.role() = 'authenticated'
)
with check (
  bucket_id = 'cover-art'
  and auth.role() = 'authenticated'
);


-- Music
create policy "Authenticated upload music"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'music'
  and auth.role() = 'authenticated'
);

create policy "Authenticated update music"
on storage.objects for update
to authenticated
using (
  bucket_id = 'music'
  and auth.role() = 'authenticated'
)
with check (
  bucket_id = 'music'
  and auth.role() = 'authenticated'
);