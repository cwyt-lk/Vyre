import {
	type ArtistDB,
	ArtistMapper,
	type GenreDB,
	GenreMapper,
} from "@/lib/mappers/domain";
import type { StorageRepositoryContract } from "@/lib/repositories";
import { flatMapList } from "@/lib/utils/array";
import { resolvePublicFileUrl } from "@/lib/utils/storage";
import type { Track, TrackAggregate } from "@/types/domain";
import type { Database } from "@/types/supabase";

// Database row type for tracks
export type TrackDB = Database["public"]["Tables"]["tracks"]["Row"];

// Track aggregate type including related genres and artists
export type TrackAggregateDB = TrackDB & {
	genres: GenreDB;
	track_artists: {
		artist_order: number;
		artists: ArtistDB;
	}[];
};

// Domain types extended with public audio URL
export type TrackWithAudio = Track & { audioUrl?: string };
export type TrackAggregateWithAudio = TrackAggregate & {
	audioUrl?: string;
};

export const TrackMapper = {
	/** Map a basic database row to the domain Track type */
	map(row: TrackDB): Track {
		return {
			id: row.id,
			title: row.title,
			genreId: row.genre_id,
			audioPath: row.audio_path,
			createdAt: new Date(row.created_at),
		};
	},

	/** Map a track with related genre and artist information */
	mapWithRelations(row: TrackAggregateDB): TrackAggregate {
		const track = TrackMapper.map(row);

		return {
			...track,
			genre: GenreMapper.map(row.genres),
			artists: flatMapList(row.track_artists, (item) =>
				ArtistMapper.map(item.artists),
			),
		};
	},

	/**
	 * Adds a public audio URL to a track using the storage repository.
	 * Works with either Track or TrackAggregate while preserving type.
	 */
	mapWithAudio<T extends Track | TrackAggregate>(
		track: T,
		storage: StorageRepositoryContract,
	): T & { audioUrl?: string } {
		return {
			...track,
			audioUrl: resolvePublicFileUrl(
				storage,
				"music",
				track.audioPath,
			),
		};
	},
};
