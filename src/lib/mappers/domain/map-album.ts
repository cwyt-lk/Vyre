import {
	type TrackAggregateDB,
	type TrackDB,
	TrackMapper,
} from "@/lib/mappers/domain/map-track";
import { flatMapList } from "@/lib/utils/array";
import type {
	Album,
	AlbumAggregate,
	AlbumFullAggregate,
} from "@/types/domain";
import type { Database } from "@/types/supabase";

export type AlbumDB = Database["public"]["Tables"]["albums"]["Row"];

export type AlbumAggregateDB = AlbumDB & {
	album_tracks: {
		tracks: TrackDB;
	}[];
};

export type AlbumFullAggregateDB = AlbumDB & {
	album_tracks: {
		tracks: TrackAggregateDB;
	}[];
};

export const AlbumMapper = {
	map(row: AlbumDB): Album {
		return {
			id: row.id,
			title: row.title,
			description: "",
			coverUrl: row.cover_url ?? null,
			releaseDate: new Date(row.release_date),
			createdAt: new Date(row.created_at),
		};
	},

	mapWithRelations(row: AlbumAggregateDB): AlbumAggregate {
		return {
			...this.map(row),

			tracks: flatMapList(row.album_tracks, (item) => {
				return TrackMapper.map(item.tracks);
			}),
		};
	},

	mapWithDetailedRelations(
		row: AlbumFullAggregateDB,
	): AlbumFullAggregate {
		return {
			...this.map(row),

			tracks: flatMapList(row.album_tracks, (item) => {
				return TrackMapper.mapWithRelations(item.tracks);
			}),
		};
	},
};
