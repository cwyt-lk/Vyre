import type { SupabaseClient } from "@supabase/supabase-js";
import { ArtistMapper, TrackMapper } from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import {
	applyQueryOptions,
	type QueryOptions,
} from "@/lib/repositories/query-options";
import type { TrackRepositoryContract } from "@/lib/repositories/track";
import { flatMapList } from "@/lib/utils/array";
import type {
	Artist,
	CreateTrack,
	Track,
	TrackAggregate,
	UpdateTrack,
} from "@/types/domain";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

const TRACK_RELATION_SELECT = `
  *,
  genres (*),
  track_artists (*, artists (*))
`;

export class TrackRepository implements TrackRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	// -----------------------------
	// Existence Checks
	// -----------------------------

	async exists(id: string): Promise<RepoResult<boolean>> {
		const { count, error } = await this.supabase
			.from("tracks")
			.select("id", { count: "exact", head: true })
			.eq("id", id);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true, data: count ? count > 0 : false };
	}

	// -----------------------------
	// Fetching / Querying
	// -----------------------------

	async findAll(options?: QueryOptions): Promise<RepoResult<Track[]>> {
		const { data, error } = await applyQueryOptions(
			this.supabase.from("tracks").select("*"),
			options,
		);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return {
			success: true,
			data: flatMapList(data, TrackMapper.map),
		};
	}

	async findById(id: string): Promise<RepoResult<Track>> {
		const { data, error } = await this.supabase
			.from("tracks")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true, data: TrackMapper.map(data) };
	}

	async findAllWithRelations(
		options?: QueryOptions,
	): Promise<RepoResult<TrackAggregate[]>> {
		const { data, error } = await applyQueryOptions(
			this.supabase.from("tracks").select(TRACK_RELATION_SELECT),
			options,
		);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return {
			success: true,
			data: flatMapList(data, TrackMapper.mapWithRelations),
		};
	}

	async findByIdWithRelations(
		id: string,
	): Promise<RepoResult<TrackAggregate>> {
		const { data, error } = await this.supabase
			.from("tracks")
			.select(TRACK_RELATION_SELECT)
			.eq("id", id)
			.single();

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return {
			success: true,
			data: TrackMapper.mapWithRelations(data),
		};
	}

	// -----------------------------
	// Creation
	// -----------------------------

	async create(track: CreateTrack): Promise<RepoResult<Track>> {
		const { data, error } = await this.supabase
			.from("tracks")
			.insert({
				title: track.title,
				genre_id: track.genreId,
				audio_path: track.audioPath,
			})
			.select()
			.single();

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true, data: TrackMapper.map(data) };
	}

	async createMany(tracks: CreateTrack[]): Promise<RepoResult<Track[]>> {
		const rows = tracks.map((t) => ({
			title: t.title,
			genre_id: t.genreId,
			audio_path: t.audioPath,
		}));

		const { data, error } = await this.supabase
			.from("tracks")
			.insert(rows)
			.select();

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return {
			success: true,
			data: flatMapList(data, TrackMapper.map),
		};
	}

	// -----------------------------
	// Updates
	// -----------------------------

	async update(updateData: UpdateTrack): Promise<RepoResult<Track>> {
		const { error, data } = await this.supabase
			.from("tracks")
			.update({
				title: updateData.title,
				genre_id: updateData.genreId,
				audio_path: updateData.audioPath,
			})
			.eq("id", updateData.id)
			.select()
			.single();

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true, data: TrackMapper.map(data) };
	}

	// -----------------------------
	// Deletion
	// -----------------------------

	async delete(id: string): Promise<RepoResult> {
		const { error } = await this.supabase
			.from("tracks")
			.delete()
			.eq("id", id);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true };
	}

	async deleteMany(ids: string[]): Promise<RepoResult> {
		const { error } = await this.supabase
			.from("tracks")
			.delete()
			.in("id", ids);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true };
	}

	// -----------------------------
	// Artist Management
	// -----------------------------

	async findArtists(
		trackId: string,
		options?: QueryOptions,
	): Promise<RepoResult<Artist[]>> {
		const { data, error } = await applyQueryOptions(
			this.supabase
				.from("track_artists")
				.select("artists (*)")
				.eq("track_id", trackId),

			options,
		);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return {
			success: true,
			data: flatMapList(
				data.map((it) => it.artists),
				ArtistMapper.map,
			),
		};
	}

	async addArtist(
		trackId: string,
		artistId: string,
		order: number,
	): Promise<RepoResult> {
		const { error } = await this.supabase
			.from("track_artists")
			.insert({
				track_id: trackId,
				artist_id: artistId,
				artist_order: order,
			});

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true };
	}

	async addArtists(
		trackId: string,
		artistIds: string[],
	): Promise<RepoResult> {
		const rows = artistIds.map((id, idx) => ({
			track_id: trackId,
			artist_id: id,
			artist_order: idx + 1,
		}));

		const { error } = await this.supabase
			.from("track_artists")
			.insert(rows);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true };
	}

	async removeArtist(
		trackId: string,
		artistId: string,
	): Promise<RepoResult> {
		return this.removeArtists(trackId, [artistId]);
	}

	async removeArtists(
		trackId: string,
		artistIds: string[],
	): Promise<RepoResult> {
		const { error } = await this.supabase
			.from("track_artists")
			.delete()
			.eq("track_id", trackId)
			.in("artist_id", artistIds);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true };
	}

	async reorderArtists(
		trackId: string,
		orderedArtistIds: string[],
	): Promise<RepoResult> {
		const payload = orderedArtistIds.map((artistId, idx) => ({
			track_id: trackId,
			artist_id: artistId,
			artist_order: idx + 1,
		}));

		const { error } = await this.supabase
			.from("track_artists")
			.upsert(payload);

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true };
	}

	// -----------------------------
	// Counts / Aggregates
	// -----------------------------

	async count(): Promise<RepoResult<number>> {
		const { count, error } = await this.supabase
			.from("tracks")
			.select("id", { count: "exact", head: true });

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true, data: count ?? 0 };
	}

	async countByArtist(artistId: string): Promise<RepoResult<number>> {
		const { count, error } = await this.supabase
			.from("track_artists")
			.select("track_id", { count: "exact", head: true })
			.eq("artist_id", artistId);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true, data: count ?? 0 };
	}
}
