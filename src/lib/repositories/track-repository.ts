import type { SupabaseClient } from "@supabase/supabase-js";
import { TrackMapper } from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import { flatMapList } from "@/lib/utils/array";
import type { Track } from "@/types/domain";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

/**
 * Contract describing persistence operations available for tracks.
 *
 * Implementations are responsible for retrieving track data
 * from the underlying data source and mapping it into domain models.
 */
export interface TrackRepositoryContract {
	/**
	 * Retrieve all tracks.
	 */
	findAll(): Promise<RepoResult<Track[]>>;

	/**
	 * Retrieve a single track by its unique identifier.
	 *
	 * @param id - Track ID
	 */
	findById(id: string): Promise<RepoResult<Track>>;
}

/**
 * Supabase-backed repository responsible for track persistence.
 *
 * This class:
 * - Executes database queries against Supabase
 * - Maps raw database rows into domain models
 * - Normalizes database errors into `RepoResult`
 */
export class TrackRepository implements TrackRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	/**
	 * Fetch all tracks from the database.
	 */
	async findAll(): Promise<RepoResult<Track[]>> {
		const { data, error } = await this.supabase
			.from("tracks")
			.select("*");

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: flatMapList(data, TrackMapper.map),
		};
	}

	/**
	 * Fetch a single track by ID.
	 *
	 * @param id - Track ID
	 */
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
}
