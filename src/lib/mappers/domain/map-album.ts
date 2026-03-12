import {
	type TrackAggregateDB,
	type TrackDB,
	TrackMapper,
} from "@/lib/mappers/domain/map-track";
import type { StorageRepositoryContract } from "@/lib/repositories";
import { flatMapList } from "@/lib/utils/array";
import { resolvePublicFileUrl } from "@/lib/utils/storage";
import type {
	Album,
	AlbumAggregate,
	AlbumFullAggregate,
} from "@/types/domain";
import type { Database } from "@/types/supabase";

// Basic album database row
export type AlbumDB = Database["public"]["Tables"]["albums"]["Row"];

// Album aggregate with basic track relations
export type AlbumAggregateDB = AlbumDB & {
	album_tracks: { tracks: TrackDB }[];
};

// Album aggregate with detailed track relations
export type AlbumFullAggregateDB = AlbumDB & {
	album_tracks: { tracks: TrackAggregateDB }[];
};

// Album types extended with a public cover URL
export type AlbumWithCover = Album & { coverUrl?: string };
export type AlbumAggregateWithCover = AlbumAggregate & {
	coverUrl?: string;
};

export const AlbumMapper = {
	/** Map a basic album row from the database to domain Album */
	map(row: AlbumDB): Album {
		return {
			id: row.id,
			title: row.title,
			description: "",
			coverPath: row.cover_path,
			releaseDate: new Date(row.release_date),
			createdAt: new Date(row.created_at),
		};
	},

	/** Map an album with related tracks (basic) */
	mapWithRelations(row: AlbumAggregateDB): AlbumAggregate {
		const album = AlbumMapper.map(row);
		return {
			...album,
			tracks: flatMapList(row.album_tracks, (item) =>
				TrackMapper.map(item.tracks),
			),
		};
	},

	/** Map an album with detailed track relations */
	mapWithDetailedRelations(
		row: AlbumFullAggregateDB,
	): AlbumFullAggregate {
		const album = AlbumMapper.map(row);
		return {
			...album,
			tracks: flatMapList(row.album_tracks, (item) =>
				TrackMapper.mapWithRelations(item.tracks),
			),
		};
	},

	/**
	 * Adds a public cover URL to an album.
	 * Works with both Album and AlbumAggregate objects.
	 */
	mapWithCover<T extends Album | AlbumAggregate>(
		album: T,
		storage: StorageRepositoryContract,
	): T & { coverUrl?: string } {
		return {
			...album,
			coverUrl: resolvePublicFileUrl(
				storage,
				"cover-art",
				album.coverPath,
			),
		};
	},
};
