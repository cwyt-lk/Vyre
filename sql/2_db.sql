/* MUSIC DATABASE SCHEMA
  Organized by dependency: Extensions -> Tables -> Junctions -> Indexes
*/

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- Useful if gen_random_uuid() isn't default

-- Optional: Cleanup for fresh migrations
-- DROP TABLE IF EXISTS album_tracks, track_artists, tracks, albums, genres, artists CASCADE;

---
--- CORE ENTITIES (Independent)
---

-- Artists: The creators
CREATE TABLE artists (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  bio          TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Genres: The classification system
CREATE TABLE genres (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key          TEXT UNIQUE NOT NULL, -- e.g. 'lo-fi'
  label        TEXT NOT NULL,        -- e.g. 'Lo-Fi'
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Albums: The collections
CREATE TABLE albums (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  release_date DATE NOT NULL DEFAULT CURRENT_DATE,
  cover_path   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

---
--- DEPENDENT ENTITIES
---

-- Tracks: The individual songs (Requires a Genre)
CREATE TABLE tracks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  genre_id     UUID NOT NULL REFERENCES genres(id) ON DELETE RESTRICT,
  audio_path   TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

---
--- JUNCTION TABLES (M:N Relationships)
---

-- Links Tracks to one or more Artists (Handles features/collaborations)
CREATE TABLE track_artists (
  track_id     UUID REFERENCES tracks(id) ON DELETE CASCADE,
  artist_id    UUID REFERENCES artists(id) ON DELETE CASCADE,
  artist_order INTEGER NOT NULL DEFAULT 0, -- 0 for Primary, 1+ for Features
  
  PRIMARY KEY (track_id, artist_id)
);

-- Links Tracks to Albums (Handles track listing and ordering)
CREATE TABLE album_tracks (
  album_id     UUID REFERENCES albums(id) ON DELETE CASCADE,
  track_id     UUID REFERENCES tracks(id) ON DELETE CASCADE,
  track_number INTEGER NOT NULL,

  PRIMARY KEY (album_id, track_id),
  CONSTRAINT unique_album_track_pos UNIQUE (album_id, track_number)
);

---
--- PERFORMANCE & SEARCH INDEXES
---

-- Fuzzy search indexes for the UI
CREATE INDEX idx_artists_name_trgm ON artists USING gin (name gin_trgm_ops);
CREATE INDEX idx_tracks_title_trgm ON tracks USING gin (title gin_trgm_ops);

-- Foreign Key optimization (Standard B-Tree)
-- Note: PKs are indexed by default; we index the secondary FKs for fast JOINs
CREATE INDEX idx_track_artists_artist_id ON track_artists(artist_id);
CREATE INDEX idx_album_tracks_track_id   ON album_tracks(track_id);
CREATE INDEX idx_tracks_genre_id         ON tracks(genre_id);