import type { SupabaseClient } from "@supabase/supabase-js";
import { TrackMapper } from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import {
	applyQueryOptions,
	type QueryOptions,
} from "@/lib/repositories/query-options";
import type { TrackRepositoryContract } from "@/lib/repositories/track";
import { flatMapList } from "@/lib/utils/array";
import type { CreateTrack, Track, TrackAggregate } from "@/types/domain";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

/** Supabase select fragment to fetch tracks with their related entities */
const TRACK_RELATION_SELECT = `
  *,
  genres (*),
  track_artists (*, artists (*))
`;

/**
 * Supabase-backed repository for track persistence.
 */
export class TrackRepository implements TrackRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	/** @inheritdoc TrackRepositoryContract.findAll */
	async findAll(options?: QueryOptions): Promise<RepoResult<Track[]>> {
		const baseQuery = this.supabase.from("tracks").select("*");
		const query = applyQueryOptions(baseQuery, options);

		const { data, error } = await query;

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: flatMapList(data, TrackMapper.map) };
	}

	/** @inheritdoc TrackRepositoryContract.findById */
	async findById(id: string): Promise<RepoResult<Track>> {
		const { data, error } = await this.supabase
			.from("tracks")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: TrackMapper.map(data) };
	}

	/** @inheritdoc TrackRepositoryContract.findAllWithRelations */
	async findAllWithRelations(
		options?: QueryOptions,
	): Promise<RepoResult<TrackAggregate[]>> {
		const baseQuery = this.supabase
			.from("tracks")
			.select(TRACK_RELATION_SELECT);

		const query = applyQueryOptions(baseQuery, options);

		const { data, error } = await query;

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: flatMapList(data, TrackMapper.mapWithRelations),
		};
	}

	/** @inheritdoc TrackRepositoryContract.findByIdWithRelations */
	async findByIdWithRelations(
		id: string,
	): Promise<RepoResult<TrackAggregate>> {
		const { data, error } = await this.supabase
			.from("tracks")
			.select(TRACK_RELATION_SELECT)
			.eq("id", id)
			.single();

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: TrackMapper.mapWithRelations(data) };
	}

	/** @inheritdoc TrackRepositoryContract.create */
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
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: TrackMapper.map(data) };
	}

	/** @inheritdoc TrackRepositoryContract.delete */
	async delete(id: string): Promise<RepoResult> {
		const { error } = await this.supabase
			.from("tracks")
			.delete()
			.eq("id", id);

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true };
	}

	/** @inheritdoc TrackRepositoryContract.addArtist */
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
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true };
	}
}
