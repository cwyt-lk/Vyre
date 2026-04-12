-- =========================================
-- Helpers
-- =========================================
CREATE OR REPLACE FUNCTION _sync_album_tracks(
  p_album_id UUID,
  p_track_ids UUID[]
)
RETURNS VOID AS $$
BEGIN
  -- Fast exit for NULL
  IF p_track_ids IS NULL THEN
    RETURN;
  END IF;

  WITH input AS (
    SELECT DISTINCT unnest_id, idx::int AS track_number
    FROM unnest(p_track_ids) WITH ORDINALITY AS t(unnest_id, idx)
  )

  DELETE FROM album_tracks at
  WHERE at.album_id = p_album_id
    AND NOT EXISTS (
      SELECT 1 FROM input i WHERE i.unnest_id = at.track_id
    );

  WITH input AS (
    SELECT DISTINCT unnest_id, idx::int AS track_number
    FROM unnest(p_track_ids) WITH ORDINALITY AS t(unnest_id, idx)
  )

  INSERT INTO album_tracks (album_id, track_id, track_number)
  SELECT p_album_id, i.unnest_id, i.track_number
  FROM input i
  ON CONFLICT (album_id, track_id) DO UPDATE
  SET track_number = EXCLUDED.track_number
  WHERE album_tracks.track_number IS DISTINCT FROM EXCLUDED.track_number;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION _sync_track_artists(
  p_track_id UUID,
  p_artist_ids UUID[]
)
RETURNS VOID AS $$
BEGIN
  IF p_artist_ids IS NULL OR array_length(p_artist_ids, 1) = 0 THEN
    RAISE EXCEPTION 'A track must have at least one artist.';
  END IF;

  WITH input AS (
    SELECT DISTINCT unnest_id
    FROM unnest(p_artist_ids) AS t(unnest_id)
  )
  
  DELETE FROM track_artists ta
  WHERE ta.track_id = p_track_id
    AND NOT EXISTS (
      SELECT 1 FROM input i WHERE i.unnest_id = ta.artist_id
    );

  WITH input AS (
    SELECT DISTINCT unnest_id, (idx - 1)::int AS artist_order
    FROM unnest(p_artist_ids) WITH ORDINALITY AS t(unnest_id, idx)
  )

  INSERT INTO track_artists (track_id, artist_id, artist_order)
  SELECT p_track_id, i.unnest_id, i.artist_order
  FROM input i
  ON CONFLICT (track_id, artist_id) DO UPDATE
  SET artist_order = EXCLUDED.artist_order
  WHERE track_artists.artist_order IS DISTINCT FROM EXCLUDED.artist_order;

END;
$$ LANGUAGE plpgsql;

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
