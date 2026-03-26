import type { QueryOptions } from "@/lib/repositories/query-options";
import type {
	Artist,
	CreateTrack,
	Track,
	TrackAggregate,
	UpdateTrack,
} from "@/types/domain";
import type { RepoListResult, RepoResult } from "@/types/results";

/**
 * Contract defining all operations for track persistence.
 *
 * Includes CRUD operations, bulk operations, artist management,
 * filtered queries, soft deletes, and relational fetching.
 */
export interface TrackRepositoryContract {
	// -----------------------------
	// Existence Checks
	// -----------------------------

	/**
	 * Check if a track exists.
	 * @param id Track ID
	 * @returns Repository result with boolean indicating existence.
	 */
	exists(id: string): Promise<RepoResult<boolean>>;

	// -----------------------------
	// Fetching / Querying
	// -----------------------------

	/**
	 * Fetch all tracks without related entities.
	 * @param options Optional query modifiers (pagination, filtering, etc.)
	 * @returns Repository result with an array of tracks.
	 */
	findAll(options?: QueryOptions): Promise<RepoResult<Track[]>>;

	/**
	 * Fetch a single track by its unique identifier.
	 * @param id Track ID
	 * @returns Repository result with the track if found.
	 */
	findById(id: string): Promise<RepoResult<Track>>;

	/**
	 * Fetch all tracks including related entities (e.g., artists, albums).
	 * @param options Optional query modifiers
	 * @returns Repository result with track aggregates.
	 */
	findAllWithRelations(
		options?: QueryOptions,
	): Promise<RepoResult<TrackAggregate[]>>;

	/**
	 * Fetch a single track with all related entities.
	 * @param id Track ID
	 * @returns Repository result with track aggregate.
	 */
	findByIdWithRelations(id: string): Promise<RepoResult<TrackAggregate>>;

	/**
	 * Search tracks by a case-insensitive title prefix.
	 * @param title Title prefix to search
	 * @param options Optional query modifiers
	 * @returns Repository result containing matching tracks with relations.
	 */
	searchByTitleWithRelations(
		title: string,
		options?: QueryOptions,
	): Promise<RepoListResult<TrackAggregate>>;

	// -----------------------------
	// Creation
	// -----------------------------

	/**
	 * Create a new track.
	 * @param track Track creation data
	 * @returns Repository result with the newly created track.
	 */
	create(track: CreateTrack): Promise<RepoResult<Track>>;

	/**
	 * Bulk create multiple tracks.
	 * @param tracks Array of track creation data
	 * @returns Repository result with created tracks.
	 */
	createMany(tracks: CreateTrack[]): Promise<RepoResult<Track[]>>;

	// -----------------------------
	// Updates
	// -----------------------------

	/**
	 * Update an existing track.
	 * @param updateData Track update payload
	 * @returns Repository result with the updated track.
	 */
	update(updateData: UpdateTrack): Promise<RepoResult<Track>>;

	// -----------------------------
	// Deletion
	// -----------------------------

	/**
	 * Permanently delete a track.
	 * @param id Track ID
	 * @returns Repository result of the deletion operation.
	 */
	delete(id: string): Promise<RepoResult>;

	/**
	 * Permanently delete multiple tracks.
	 * @param ids Array of track IDs
	 * @returns Repository result of the deletion operation.
	 */
	deleteMany(ids: string[]): Promise<RepoResult>;

	// -----------------------------
	// Artist Management
	// -----------------------------

	/**
	 * Finds all artists under a track.
	 * @param trackId Track ID
	 * @param options Query Options (ordering, ranges, etc.)
	 */
	findArtists(
		trackId: string,
		options?: QueryOptions,
	): Promise<RepoResult<Artist[]>>;

	/**
	 * Add a single artist to a track.
	 * @param trackId Track ID
	 * @param artistId Artist ID
	 * @param order - Artist's Order
	 * @returns Repository result of the addition operation.
	 */
	addArtist(
		trackId: string,
		artistId: string,
		order: number,
	): Promise<RepoResult>;

	/**
	 * Add multiple artists to a track.
	 * @param trackId Track ID
	 * @param artistIds Array of artist IDs
	 * @returns Repository result of the addition operation.
	 */
	addArtists(trackId: string, artistIds: string[]): Promise<RepoResult>;

	/**
	 * Remove a single artist from a track.
	 * @param trackId Track ID
	 * @param artistId Artist ID
	 * @returns Repository result of the removal operation.
	 */
	removeArtist(trackId: string, artistId: string): Promise<RepoResult>;

	/**
	 * Remove multiple artists from a track.
	 * @param trackId Track ID
	 * @param artistIds Array of artist IDs
	 * @returns Repository result of the removal operation.
	 */
	removeArtists(
		trackId: string,
		artistIds: string[],
	): Promise<RepoResult>;

	/**
	 * Reorder artists in a track.
	 * @param trackId Track ID
	 * @param orderedArtistIds Array of artist IDs in the new order
	 * @returns Repository result of the reorder operation.
	 */
	reorderArtists(
		trackId: string,
		orderedArtistIds: string[],
	): Promise<RepoResult>;

	// -----------------------------
	// Counts / Aggregates
	// -----------------------------

	/**
	 * Fetch the total number of tracks.
	 * @returns Repository result with track count.
	 */
	count(): Promise<RepoResult<number>>;

	/**
	 * Count tracks by a specific artist.
	 * @param artistId Artist ID
	 * @returns Repository result with track count.
	 */
	countByArtist(artistId: string): Promise<RepoResult<number>>;
}
