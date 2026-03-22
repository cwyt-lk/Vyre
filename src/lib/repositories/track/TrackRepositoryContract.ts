import type { QueryOptions } from "@/lib/repositories/query-options";
import type { CreateTrack, Track, TrackAggregate } from "@/types/domain";
import type { RepoResult } from "@/types/results";

/**
 * Repository contract defining persistence operations for tracks.
 *
 * Abstracts data access and maps database rows into domain models.
 */
export interface TrackRepositoryContract {
	/** Fetch all tracks */
	findAll(options?: QueryOptions): Promise<RepoResult<Track[]>>;

	/**
	 * Fetch a single track by ID
	 * @param id - Track ID
	 */
	findById(id: string): Promise<RepoResult<Track>>;

	/** Fetch all tracks with related entities */
	findAllWithRelations(
		options?: QueryOptions,
	): Promise<RepoResult<TrackAggregate[]>>;

	/**
	 * Fetch a single track by ID with related entities
	 * @param id - Track ID
	 */
	findByIdWithRelations(id: string): Promise<RepoResult<TrackAggregate>>;

	/**
	 * Create a new track
	 * @param track - Track creation data
	 */
	create(track: CreateTrack): Promise<RepoResult<Track>>;

	/**
	 * Delete a track
	 * @param id - Track ID
	 */
	delete(id: string): Promise<RepoResult>;

	/**
	 * Add an artist to a track
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
