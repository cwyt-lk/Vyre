import type { SupabaseClient } from "@supabase/supabase-js";
import { TrackMapper } from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import { flatMapList } from "@/lib/utils/array";
import type { CreateTrack, Track } from "@/types/domain";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

/**
 * Repository contract defining persistence operations for tracks.
 *
 * Abstracts data access and maps database rows into domain models.
 */
export interface TrackRepositoryContract {
	/** Fetch all tracks */
	findAll(): Promise<RepoResult<Track[]>>;

	/** Fetch a single track by ID
	 * @param id - Track unique identifier
	 */
	findById(id: string): Promise<RepoResult<Track>>;

	/** Create a new track
	 * @param track - Track creation data
	 */
	create(track: CreateTrack): Promise<RepoResult<Track>>;

	/** Add an artist to a track
	 * @param trackId - Track unique identifier
	 * @param artistId - Artist unique identifier
	 * @param order - Position of the artist within the track
	 */
	addArtist(
		trackId: string,
		artistId: string,
		order: number,
	): Promise<RepoResult>;
}

/**
 * Supabase-backed repository for track persistence.
 *
 * Handles:
 * - Executing database queries
 * - Mapping raw rows into domain models
 * - Normalizing database errors into `RepoResult`
 */
export class TrackRepository implements TrackRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	/** {@inheritDoc TrackRepositoryContract.findAll} */
	async findAll(): Promise<RepoResult<Track[]>> {
		const { data, error } = await this.supabase
			.from("tracks")
			.select("*");

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: flatMapList(data, TrackMapper.map) };
	}

	/** {@inheritDoc TrackRepositoryContract.findById} */
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

	/** {@inheritDoc TrackRepositoryContract.create} */
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

	/** {@inheritDoc TrackRepositoryContract.addArtist} */
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
