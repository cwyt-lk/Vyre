import type { QueryOptions } from "@/lib/repositories/query-options";
import type {
	Album,
	AlbumAggregate,
	AlbumFullAggregate,
	CreateAlbum,
	Track,
	TrackAggregate,
	UpdateAlbum,
} from "@/types/domain";
import type { RepoListResult, RepoResult } from "@/types/results";

/**
 * Contract defining all operations for album persistence.
 *
 * Includes CRUD operations, bulk operations, track management,
 * filtered queries, soft deletes, and relational fetching.
 */
export interface AlbumRepositoryContract {
	// -----------------------------
	// Existence Checks
	// -----------------------------

	/**
	 * Check if an album exists.
	 * @param id Album ID
	 * @returns Repository result with boolean indicating existence.
	 */
	exists(id: string): Promise<RepoResult<boolean>>;

	// -----------------------------
	// Fetching / Querying
	// -----------------------------

	/**
	 * Fetch all albums without any related entities.
	 * @param options Optional query modifiers (pagination, filtering, etc.)
	 * @returns Repository result containing an array of albums.
	 */
	findAll(options?: QueryOptions): Promise<RepoResult<Album[]>>;

	/**
	 * Fetch a single album by its unique identifier.
	 * @param id Album ID
	 * @returns Repository result with the album if found.
	 */
	findById(id: string): Promise<RepoResult<Album>>;

	/**
	 * Search albums by a case-insensitive title prefix.
	 * @param title Title prefix to search
	 * @param options Optional query modifiers
	 * @returns Repository result containing matching albums.
	 */
	searchByTitle(
		title: string,
		options?: QueryOptions,
	): Promise<RepoListResult<Album>>;

	/**
	 * Fetch all albums including their nested track relations.
	 * @param options Optional query modifiers
	 * @returns Repository result with album aggregates.
	 */
	findAllWithRelations(
		options?: QueryOptions,
	): Promise<RepoResult<AlbumAggregate[]>>;

	/**
	 * Fetch a single album with all nested relations (tracks, artist, genres, etc.)
	 * @param id Album ID
	 * @returns Repository result with full album aggregate.
	 */
	findByIdWithRelations(
		id: string,
	): Promise<RepoResult<AlbumFullAggregate>>;

	/**
	 * Retrieve tracks belonging to a specific album, without related entities.
	 * @param id Album ID
	 * @param options Optional query modifiers
	 * @returns Repository result with the list of tracks.
	 */
	findTracksByAlbumId(
		id: string,
		options?: QueryOptions,
	): Promise<RepoResult<Track[]>>;

	/**
	 * Retrieve tracks for an album, including their related entities.
	 * @param id Album ID
	 * @param options Optional query modifiers
	 * @returns Repository result with track aggregates.
	 */
	findTracksByAlbumIdWithRelations(
		id: string,
		options?: QueryOptions,
	): Promise<RepoResult<TrackAggregate[]>>;

	// -----------------------------
	// Creation
	// -----------------------------

	/**
	 * Create a new album.
	 * @param album Album data to create
	 * @returns Repository result with the newly created album.
	 */
	create(album: CreateAlbum): Promise<RepoResult<Album>>;

	/**
	 * Creates a new album along with its associated tracks.
	 *
	 * @param createData - The album and track data required to create the album.
	 * @returns A promise that resolves to a RepoResult containing the created Album.
	 */
	createAlbumWithTracks(
		createData: CreateAlbum,
	): Promise<RepoResult<Album>>;

	// -----------------------------
	// Updates
	// -----------------------------

	/**
	 * Update an existing album.
	 * @param updateData Album update payload
	 * @returns Repository result with the updated album.
	 */
	update(updateData: UpdateAlbum): Promise<RepoResult<Album>>;

	/**
	 * Updates an existing album and its associated tracks.
	 *
	 * @param updateData - The updated album and track data.
	 * @returns A promise that resolves to a RepoResult indicating the success or failure of the operation.
	 */
	updateAlbumWithTracks(updateData: UpdateAlbum): Promise<RepoResult>;

	// -----------------------------
	// Deletion
	// -----------------------------

	/**
	 * Delete an album permanently.
	 * @param id Album ID
	 * @returns Repository result of the deletion operation.
	 */
	delete(id: string): Promise<RepoResult>;

	// -----------------------------
	// Counts / Aggregates
	// -----------------------------

	/**
	 * Fetch the total number of albums.
	 * @returns Repository result with the album count.
	 */
	count(): Promise<RepoResult<number>>;
}
