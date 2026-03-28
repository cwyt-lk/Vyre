-- =========================================
-- Helpers
-- =========================================
CREATE OR REPLACE FUNCTION _sync_album_tracks(
  p_album_id UUID,
  p_track_ids UUID[]
)
RETURNS VOID AS $$
BEGIN
  -- 1. Remove tracks no longer in the list
  DELETE FROM album_tracks
  WHERE album_id = p_album_id
    AND track_id != ALL(p_track_ids);

  -- 2. Insert new tracks or update order (using your ordinality logic)
  INSERT INTO album_tracks (album_id, track_id, track_number)
  SELECT p_album_id, unnest_id, idx::int
  FROM unnest(p_track_ids) WITH ORDINALITY AS t(unnest_id, idx)
  ON CONFLICT (album_id, track_id) DO UPDATE
  SET track_number = EXCLUDED.track_number;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION _sync_track_artists(
  p_track_id UUID,
  p_artist_ids UUID[]
)
RETURNS VOID AS $$
BEGIN
  -- 1. Validation: Ensure the array isn't empty (Business Rule)
  IF p_artist_ids IS NULL OR array_length(p_artist_ids, 1) = 0 THEN
    RAISE EXCEPTION 'A track must have at least one artist.';
  END IF;

  -- 2. Remove artists no longer associated
  DELETE FROM track_artists
  WHERE track_id = p_track_id
    AND artist_id != ALL(p_artist_ids);

  -- 3. Upsert associations with correct ordering
  INSERT INTO track_artists (track_id, artist_id, artist_order)
  SELECT p_track_id, unnest_id, (idx - 1)
  FROM unnest(p_artist_ids) WITH ORDINALITY AS t(unnest_id, idx)
  ON CONFLICT (track_id, artist_id) DO UPDATE
  SET artist_order = EXCLUDED.artist_order;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- Create Album
-- =========================================
CREATE OR REPLACE FUNCTION create_album_with_tracks(
  p_title TEXT,
  p_cover_path TEXT,
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
