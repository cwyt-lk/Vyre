-- =========================================================
-- 1. EXTENSIONS
-- =========================================================

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Fuzzy search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";


-- =========================================================
-- 2. CORE ENTITIES
-- =========================================================

-- Artists
CREATE TABLE artists (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  bio          TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Genres
CREATE TABLE genres (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key          TEXT UNIQUE NOT NULL,
  label        TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Albums
CREATE TABLE albums (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  release_date DATE NOT NULL DEFAULT CURRENT_DATE,
  cover_path   TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- =========================================================
-- 3. DEPENDENT ENTITIES
-- =========================================================

-- Tracks
CREATE TABLE tracks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  genre_id     UUID NOT NULL REFERENCES genres(id) ON DELETE RESTRICT,
  audio_path   TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- =========================================================
-- 4. JUNCTION TABLES (M:N)
-- =========================================================

-- Track <-> Artists
CREATE TABLE track_artists (
  track_id     UUID REFERENCES tracks(id) ON DELETE CASCADE,
  artist_id    UUID REFERENCES artists(id) ON DELETE CASCADE,
  artist_order INTEGER NOT NULL CHECK (artist_order >= 0),

  PRIMARY KEY (track_id, artist_id),
  CONSTRAINT unique_track_artist_pos UNIQUE (track_id, artist_order)
);

-- Album <-> Tracks
CREATE TABLE album_tracks (
  album_id     UUID REFERENCES albums(id) ON DELETE CASCADE,
  track_id     UUID REFERENCES tracks(id) ON DELETE CASCADE,
  track_number INTEGER NOT NULL CHECK (track_number >= 0),

  PRIMARY KEY (album_id, track_id),
  CONSTRAINT unique_album_track_pos UNIQUE (album_id, track_number)
);


-- =========================================================
-- 5. INDEXES
-- =========================================================

-- Fuzzy search
CREATE INDEX idx_artists_name_trgm ON artists USING gin (name gin_trgm_ops);
CREATE INDEX idx_tracks_title_trgm ON tracks USING gin (title gin_trgm_ops);

-- Case-insensitive uniqueness (optional but recommended)
CREATE UNIQUE INDEX unique_artist_name ON artists (LOWER(name));
CREATE UNIQUE INDEX unique_genre_key ON genres (LOWER(key));

-- Foreign key indexes (performance)
CREATE INDEX idx_tracks_genre_id           ON tracks(genre_id);
CREATE INDEX idx_track_artists_artist_id   ON track_artists(artist_id);
CREATE INDEX idx_album_tracks_track_id     ON album_tracks(track_id);
CREATE INDEX idx_album_tracks_album_id     ON album_tracks(album_id);


-- =========================================================
-- 6. UPDATED_AT TRIGGERS
-- =========================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_artists_updated_at
BEFORE UPDATE ON artists
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_genres_updated_at
BEFORE UPDATE ON genres
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_albums_updated_at
BEFORE UPDATE ON albums
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_tracks_updated_at
BEFORE UPDATE ON tracks
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
