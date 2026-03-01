import { type GenreDB, mapGenre } from "@/lib/mappers";
import type { Track } from "@/types/domain";
import type { Database } from "@/types/supabase";

export type TrackDB = Database["public"]["Tables"]["tracks"]["Row"] & {
	genres: GenreDB | null;
};

export function mapTrack(db: TrackDB): Track {
	return {
		id: db.id,
		title: db.title,
		artists: db.artists,
		description: db.description,
		genre: db.genres && mapGenre(db.genres),
		filePath: db.file_path,
		createdAt: new Date(db.created_at),
	};
}
