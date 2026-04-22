/* =========================================================
   ROW LEVEL SECURITY POLICIES
========================================================= */

-- =========================================================
-- ENABLE RLS
-- =========================================================

ALTER TABLE artists        ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres         ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_artists  ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_tracks   ENABLE ROW LEVEL SECURITY;


-- =========================================================
-- 1. PUBLIC READ ACCESS
-- =========================================================

CREATE POLICY artists_read_all
ON artists FOR SELECT
TO PUBLIC
USING (TRUE);

CREATE POLICY genres_read_all
ON genres FOR SELECT
TO PUBLIC
USING (TRUE);

CREATE POLICY albums_read_all
ON albums FOR SELECT
TO PUBLIC
USING (TRUE);

CREATE POLICY tracks_read_all
ON tracks FOR SELECT
TO PUBLIC
USING (TRUE);

CREATE POLICY track_artists_read_all
ON track_artists FOR SELECT
TO PUBLIC
USING (TRUE);

CREATE POLICY album_tracks_read_all
ON album_tracks FOR SELECT
TO PUBLIC
USING (TRUE);


-- =========================================================
-- 2. ADMIN WRITE ACCESS
-- =========================================================

-- Artists
CREATE POLICY artists_insert_admin
ON artists FOR INSERT
TO AUTHENTICATED
WITH CHECK (public.has_role('admin'));

CREATE POLICY artists_update_admin
ON artists FOR UPDATE
TO AUTHENTICATED
USING (public.has_role('admin'))
WITH CHECK (public.has_role('admin'));

CREATE POLICY artists_delete_admin
ON artists FOR DELETE
TO AUTHENTICATED
USING (public.has_role('admin'));


-- Genres
CREATE POLICY genres_insert_admin
ON genres FOR INSERT
TO AUTHENTICATED
WITH CHECK (public.has_role('admin'));

CREATE POLICY genres_update_admin
ON genres FOR UPDATE
TO AUTHENTICATED
USING (public.has_role('admin'))
WITH CHECK (public.has_role('admin'));

CREATE POLICY genres_delete_admin
ON genres FOR DELETE
TO AUTHENTICATED
USING (public.has_role('admin'));


-- Albums
CREATE POLICY albums_insert_admin
ON albums FOR INSERT
TO AUTHENTICATED
WITH CHECK (public.has_role('admin'));

CREATE POLICY albums_update_admin
ON albums FOR UPDATE
TO AUTHENTICATED
USING (public.has_role('admin'))
WITH CHECK (public.has_role('admin'));

CREATE POLICY albums_delete_admin
ON albums FOR DELETE
TO AUTHENTICATED
USING (public.has_role('admin'));


-- Tracks
CREATE POLICY tracks_insert_admin
ON tracks FOR INSERT
TO AUTHENTICATED
WITH CHECK (public.has_role('admin'));

CREATE POLICY tracks_update_admin
ON tracks FOR UPDATE
TO AUTHENTICATED
USING (public.has_role('admin'))
WITH CHECK (public.has_role('admin'));

CREATE POLICY tracks_delete_admin
ON tracks FOR DELETE
TO AUTHENTICATED
USING (public.has_role('admin'));


-- Track <-> Artists
CREATE POLICY track_artists_insert_admin
ON track_artists FOR INSERT
TO AUTHENTICATED
WITH CHECK (public.has_role('admin'));

CREATE POLICY track_artists_update_admin
ON track_artists FOR UPDATE
TO AUTHENTICATED
USING (public.has_role('admin'))
WITH CHECK (public.has_role('admin'));

CREATE POLICY track_artists_delete_admin
ON track_artists FOR DELETE
TO AUTHENTICATED
USING (public.has_role('admin'));


-- Album <-> Tracks
CREATE POLICY album_tracks_insert_admin
ON album_tracks FOR INSERT
TO AUTHENTICATED
WITH CHECK (public.has_role('admin'));

CREATE POLICY album_tracks_update_admin
ON album_tracks FOR UPDATE
TO AUTHENTICATED
USING (public.has_role('admin'))
WITH CHECK (public.has_role('admin'));

CREATE POLICY album_tracks_delete_admin
ON album_tracks FOR DELETE
TO AUTHENTICATED
USING (public.has_role('admin'));
