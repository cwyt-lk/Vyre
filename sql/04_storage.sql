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
-- ADMIN ACCESS: Cover Art
-- ---------------------------------------------------------

CREATE POLICY "Admin Select Cover Art" ON storage.objects 
FOR SELECT TO authenticated 
USING (bucket_id = 'cover-art' AND has_role('admin'));

CREATE POLICY "Admin Update Cover Art" ON storage.objects 
FOR UPDATE TO authenticated 
USING (bucket_id = 'cover-art' AND has_role('admin'));

CREATE POLICY "Admin Insert Cover Art" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'cover-art' AND has_role('admin'));

CREATE POLICY "Admin Delete Cover Art" ON storage.objects 
FOR DELETE TO authenticated 
USING (bucket_id = 'cover-art' AND has_role('admin'));

-- ---------------------------------------------------------
-- ADMIN ACCESS: Music
-- ---------------------------------------------------------

CREATE POLICY "Admin Select Music" ON storage.objects 
FOR SELECT TO authenticated 
USING (bucket_id = 'music' AND has_role('admin'));

CREATE POLICY "Admin Update Music" ON storage.objects 
FOR UPDATE TO authenticated 
USING (bucket_id = 'music' AND has_role('admin'));

CREATE POLICY "Admin Insert Music" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'music' AND has_role('admin'));

CREATE POLICY "Admin Delete Music" ON storage.objects 
FOR DELETE TO authenticated 
USING (bucket_id = 'music' AND has_role('admin'));