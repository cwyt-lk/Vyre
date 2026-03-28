/* =========================================================
   STORAGE SETUP (Buckets + Policies)
========================================================= */

-- =========================================================
-- 1. CREATE BUCKETS
-- =========================================================

INSERT INTO storage.buckets (id, name, public, allowed_mime_types)
VALUES
  (
    'cover-art',
    'cover-art',
    TRUE,
    ARRAY['image/*']
  ),
  (
    'music',
    'music',
    TRUE,
    ARRAY['audio/*']
  )
ON CONFLICT (id) DO NOTHING;


-- =========================================================
-- 3. POLICIES
-- =========================================================

-- ---------------------------------------------------------
-- PUBLIC READ (since buckets are public)
-- ---------------------------------------------------------

CREATE POLICY "Public read cover-art"
ON storage.objects FOR SELECT
USING (bucket_id = 'cover-art');

CREATE POLICY "Public read music"
ON storage.objects FOR SELECT
USING (bucket_id = 'music');


-- ---------------------------------------------------------
-- AUTHENTICATED WRITE ACCESS
-- ---------------------------------------------------------

-- Cover Art
CREATE POLICY "Authenticated upload cover-art"
ON storage.objects FOR INSERT
TO AUTHENTICATED
WITH CHECK (
  bucket_id = 'cover-art'
  AND AUTH.ROLE() = 'authenticated'
  AND check_role('admin')
);

CREATE POLICY "Authenticated update cover-art"
ON storage.objects FOR UPDATE
TO AUTHENTICATED
USING (
  bucket_id = 'cover-art'
  AND AUTH.ROLE() = 'authenticated'
  AND check_role('admin')
)
WITH CHECK (
  bucket_id = 'cover-art'
  AND AUTH.ROLE() = 'authenticated'
  AND check_role('admin')
);


-- Music
CREATE POLICY "Authenticated upload music"
ON storage.objects FOR INSERT
TO AUTHENTICATED
WITH CHECK (
  bucket_id = 'music'
  AND AUTH.ROLE() = 'authenticated'
  AND check_role('admin')
);

CREATE POLICY "Authenticated update music"
ON storage.objects FOR UPDATE
TO AUTHENTICATED
USING (
  bucket_id = 'music'
  AND AUTH.ROLE() = 'authenticated'
  AND check_role('admin')
)
WITH CHECK (
  bucket_id = 'music'
  AND AUTH.ROLE() = 'authenticated'
  AND check_role('admin')
);
