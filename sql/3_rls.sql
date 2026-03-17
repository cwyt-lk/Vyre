---
--- ROW-LEVEL SECURITY POLICIES
---

-- Enable RLS for tables where needed
ALTER TABLE artists        ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres         ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_artists  ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_tracks   ENABLE ROW LEVEL SECURITY;

------------------------------------------------
-- 1. Artists
------------------------------------------------

-- Allow all users to read
CREATE POLICY artists_read_all
ON artists
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

-- Admins can insert
CREATE POLICY artists_insert_admin
ON artists
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    check_role('admin')
);

-- Admins can update
CREATE POLICY artists_update_admin
ON artists
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
    check_role('admin')
)
WITH CHECK (
    check_role('admin')
);

-- Admins can delete
CREATE POLICY artists_delete_admin
ON artists
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    check_role('admin')
);

------------------------------------------------
-- 2. Genres
------------------------------------------------

CREATE POLICY genres_read_all
ON genres
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

CREATE POLICY genres_insert_admin
ON genres
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    check_role('admin')
);

CREATE POLICY genres_update_admin
ON genres
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
    check_role('admin')
)
WITH CHECK (
    check_role('admin')
);

CREATE POLICY genres_delete_admin
ON genres
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    check_role('admin')
);

------------------------------------------------
-- 3. Albums
------------------------------------------------

CREATE POLICY albums_read_all
ON albums
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

CREATE POLICY albums_insert_admin
ON albums
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    check_role('admin')
);

CREATE POLICY albums_update_admin
ON albums
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
    check_role('admin')
)
WITH CHECK (
    check_role('admin')
);

CREATE POLICY albums_delete_admin
ON albums
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    check_role('admin')
);

------------------------------------------------
-- 4. Tracks
------------------------------------------------

CREATE POLICY tracks_read_all
ON tracks
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

CREATE POLICY tracks_insert_admin
ON tracks
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    check_role('admin')
);

CREATE POLICY tracks_update_admin
ON tracks
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
    check_role('admin')
)
WITH CHECK (
    check_role('admin')
);

CREATE POLICY tracks_delete_admin
ON tracks
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    check_role('admin')
);

------------------------------------------------
-- 5. Track_Artists (junction)
------------------------------------------------

CREATE POLICY track_artists_read_all
ON track_artists
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

CREATE POLICY track_artists_insert_admin
ON track_artists
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    check_role('admin')
);

CREATE POLICY track_artists_delete_admin
ON track_artists
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    check_role('admin')
);

------------------------------------------------
-- 6. Album_Tracks (junction)
------------------------------------------------

CREATE POLICY album_tracks_read_all
ON album_tracks
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

CREATE POLICY album_tracks_insert_admin
ON album_tracks
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    check_role('admin')
);

CREATE POLICY album_tracks_delete_admin
ON album_tracks
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    check_role('admin')
);