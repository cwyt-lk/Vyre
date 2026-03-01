import { mapTrack, type TrackDB } from "@/lib/mappers";
import type { Album } from "@/types/domain";
import type { Database } from "@/types/supabase";

export type AlbumDB = Database["public"]["Tables"]["albums"]["Row"] & {
	tracks: TrackDB[];
};

export function mapAlbum(db: AlbumDB): Album {
	return {
		id: db.id,
		title: db.title,
		description: db.description,
		coverPath: db.cover_path,
		tracks: db.tracks.map((track) => mapTrack(track)),
		createdAt: new Date(db.created_at),
	};
}
