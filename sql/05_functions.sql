-- =========================================
-- Helpers
-- =========================================
CREATE OR REPLACE FUNCTION _sync_album_tracks(
  p_album_id UUID,
  p_track_ids UUID[]
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Treat NULL as a no-op to avoid unintentionally wiping relationships.
  IF p_track_ids IS NULL THEN
    RETURN;
  END IF;

  -- Fail fast if the input contains duplicates.
  -- This protects against violating unique constraints
  IF EXISTS (
    SELECT 1
    FROM unnest(p_track_ids) x
    GROUP BY x
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate track IDs are not allowed.';
  END IF;

  -- Acquire row-level locks for all existing relationships for this album.
  -- This prevents concurrent sync operations from interleaving and causing
  -- inconsistent ordering or constraint violations.
  PERFORM 1
  FROM album_tracks
  WHERE album_id = p_album_id
  FOR UPDATE;

  -- Build the desired final state in a temporary table.
  -- This allows us to:
  --   1. Normalize ordering deterministically
  --   2. Avoid partial updates if something fails mid-operation
  --   3. Perform a clean delete + insert strategy
  CREATE TEMP TABLE tmp_album_tracks (
    track_id UUID,
    track_number INT
  ) ON COMMIT DROP;

  -- Populate temp table using WITH ORDINALITY to preserve input order.
  -- We convert to 0-based indexing for track_number.
  INSERT INTO tmp_album_tracks (track_id, track_number)
  SELECT track_id, (idx - 1)::int
  FROM unnest(p_track_ids) WITH ORDINALITY AS t(track_id, idx);

  -- Remove all existing relationships for this album.
  -- This ensures we fully replace the set rather than diffing.
  DELETE FROM album_tracks
  WHERE album_id = p_album_id;

  -- Insert the new canonical state from the temp table.
  INSERT INTO album_tracks (album_id, track_id, track_number)
  SELECT p_album_id, track_id, track_number
  FROM tmp_album_tracks;
END;
$$;


CREATE OR REPLACE FUNCTION _sync_track_artists(
  p_track_id UUID,
  p_artist_ids UUID[]
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Treat NULL as a no-op to avoid unintentionally wiping relationships.
  IF p_artist_ids IS NULL THEN
    RETURN;
  END IF;

  -- Fail fast if the input contains duplicates.
  -- This protects against violating unique constraints
  IF EXISTS (
    SELECT 1
    FROM unnest(p_artist_ids) x
    GROUP BY x
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate artist IDs are not allowed.';
  END IF;

  -- Acquire row-level locks for all existing relationships for this track.
  -- This prevents concurrent sync operations from interleaving and causing
  -- inconsistent ordering or constraint violations.
  PERFORM 1
  FROM track_artists
  WHERE track_id = p_track_id
  FOR UPDATE;

  -- Build the desired final state in a temporary table.
  -- This allows us to:
  --   1. Normalize ordering deterministically
  --   2. Avoid partial updates if something fails mid-operation
  --   3. Perform a clean delete + insert strategy
  CREATE TEMP TABLE tmp_track_artists (
    artist_id UUID,
    artist_order INT
  ) ON COMMIT DROP;

  -- Populate temp table using WITH ORDINALITY to preserve input order.
  -- We convert to 0-based indexing for track_number.
  INSERT INTO tmp_track_artists (artist_id, artist_order)
  SELECT artist_id, (idx - 1)::int
  FROM unnest(p_artist_ids) WITH ORDINALITY AS t(artist_id, idx);

  -- Remove all existing relationships for this track.
  -- This ensures we fully replace the set rather than diffing.
  DELETE FROM track_artists
  WHERE track_id = p_track_id;

  -- Insert the new canonical state from the temp table.
  INSERT INTO track_artists (track_id, artist_id, artist_order)
  SELECT p_track_id, artist_id, artist_order
  FROM tmp_track_artists;
END;
$$;

-- Make helper functions effectively private.
-- Only explicitly granted roles (e.g., via API wrapper functions) can execute them.
REVOKE ALL ON FUNCTION _sync_track_artists FROM PUBLIC;
REVOKE ALL ON FUNCTION _sync_album_tracks FROM PUBLIC;


-- =========================================
-- Create Album
-- =========================================
CREATE OR REPLACE FUNCTION create_album_with_tracks(
  p_title TEXT,
  p_cover_path TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_release_date DATE DEFAULT NULL,
  p_track_ids UUID[] DEFAULT '{}'
)
RETURNS JSONB AS $$
DECLARE
  v_album_record RECORD;
BEGIN
  -- 1. Validation
  IF p_title IS NULL OR p_title = '' THEN
    RAISE EXCEPTION 'Album title is required.';
  END IF;

  -- 2. Insert Album
  INSERT INTO albums (title, description, cover_path, release_date)
  VALUES (p_title, p_description, p_cover_path, p_release_date)
  RETURNING * INTO v_album_record;

  -- 3. Sync Tracks
  IF array_length(p_track_ids, 1) > 0 THEN
    PERFORM _sync_album_tracks(v_album_record.id, p_track_ids);
  END IF;

  RETURN jsonb_build_object(
      'success', true,
      'data', to_jsonb(v_album_record)
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql;


-- =========================================
-- Update Album
-- =========================================
CREATE OR REPLACE FUNCTION update_album_with_tracks(
  p_id UUID,
  p_title TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_cover_path TEXT DEFAULT NULL,
  p_release_date DATE DEFAULT NULL,
  p_track_ids UUID[] DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_album_record RECORD;
BEGIN
  -- 1. Update Album (Only fields that are NOT NULL)
  UPDATE albums
  SET
    title        = COALESCE(NULLIF(p_title, ''), title),
    description  = COALESCE(p_description, description),
    cover_path   = COALESCE(NULLIF(p_cover_path, ''), cover_path),
    release_date = COALESCE(p_release_date, release_date),
    updated_at   = now()
  WHERE id = p_id
  RETURNING * INTO v_album_record;

  -- 2. Check if album existed
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Album with ID % not found.', p_id;
  END IF;

  -- 3. Sync Tracks
  IF p_track_ids IS NOT NULL THEN
    PERFORM _sync_album_tracks(p_id, p_track_ids);
  END IF;

  RETURN jsonb_build_object(
      'success', true,
      'data', to_jsonb(v_album_record)
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql;


-- =========================================
-- Create Track
-- =========================================
CREATE OR REPLACE FUNCTION create_track_with_artists(
  p_title TEXT,
  p_genre_id UUID,
  p_audio_path TEXT,
  p_artist_ids UUID[]
)
RETURNS JSONB AS $$
DECLARE
  v_track_record RECORD;
BEGIN
  -- 1. Basic Validation
  IF p_title IS NULL OR p_title = '' THEN
    RAISE EXCEPTION 'Track title is required.';
  END IF;

  -- 2. Insert Track
  INSERT INTO tracks (id, title, genre_id, audio_path)
  VALUES (
    gen_random_uuid(),
    p_title,
    p_genre_id,
    COALESCE(p_audio_path, '')
  )
  RETURNING * INTO v_track_record;

  -- 3. Sync Artists (Mandatory for creation)
  PERFORM _sync_track_artists(v_track_record.id, p_artist_ids);

  RETURN jsonb_build_object(
      'success', true,
      'data', to_jsonb(v_track_record)
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql;


-- =========================================
-- Update Track
-- =========================================
CREATE OR REPLACE FUNCTION update_track_with_artists(
  p_id UUID,
  p_title TEXT DEFAULT NULL,
  p_genre_id UUID DEFAULT NULL,
  p_audio_path TEXT DEFAULT NULL,
  p_artist_ids UUID[] DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_track_record RECORD;
BEGIN
  -- 1. Update Track fields
  UPDATE tracks
  SET
      title      = COALESCE(NULLIF(p_title, ''), title),
      genre_id   = COALESCE(p_genre_id, genre_id),
      audio_path = COALESCE(NULLIF(p_audio_path, ''), audio_path),
      updated_at = now()
  WHERE id = p_id
  RETURNING * INTO v_track_record;

  -- 2. Check existence
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Track with ID % not found.', p_id;
  END IF;

  -- 3. Sync Artists
  IF p_artist_ids IS NOT NULL THEN
    PERFORM _sync_track_artists(p_id, p_artist_ids);
  END IF;

  RETURN jsonb_build_object(
      'success', true,
      'data', to_jsonb(v_track_record)
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql;
