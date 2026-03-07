import {
	type ArtistDB,
	ArtistMapper,
	type GenreDB,
	GenreMapper,
} from "@/lib/mappers/domain";
import { flatMapList } from "@/lib/utils/array";
import type { Track, TrackAggregate } from "@/types/domain";
import type { Database } from "@/types/supabase";

export type TrackDB = Database["public"]["Tables"]["tracks"]["Row"];
export type TrackAggregateDB = TrackDB & {
	genres: GenreDB;

	track_artists: {
		artist_order: number;
		artists: ArtistDB;
	}[];
};

export const TrackMapper = {
	map(row: TrackDB): Track {
		return {
			id: row.id,
			title: row.title,
			genreId: row.genre_id,
			audioPath: row.audio_path,
			createdAt: new Date(row.created_at),
		};
	},

	mapWithRelations(row: TrackAggregateDB): TrackAggregate {
		return {
			...this.map(row),

			genre: GenreMapper.map(row.genres),

			artists: flatMapList(row.track_artists, (item) => {
				return ArtistMapper.map(item.artists);
			}),
		};
	},
};
