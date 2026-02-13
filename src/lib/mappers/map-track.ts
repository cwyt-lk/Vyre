import { type GenreDB, mapGenre } from "@/lib/mappers/map-genre";
import type { Database } from "@/types/supabase";
import type { Track } from "@/types/track";

export type TrackDB =
	Database["public"]["Tables"]["tracks"]["Row"] & {
		genres: GenreDB;
	};

export function mapTrack(db: TrackDB): Track {
	return {
		id: db.id,
		title: db.title,
		artists: db.artists,
		description: db.description,
		genre: mapGenre(db.genres),
		createdAt: new Date(db.created_at),
	};
}
