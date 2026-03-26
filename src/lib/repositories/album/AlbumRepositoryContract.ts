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
	 * Find all albums by a specific artist.
	 * @param artistId Artist ID
	 * @param options Optional query modifiers
	 * @returns Repository result with matching albums.
	 */
	findByArtistId(
		artistId: string,
		options?: QueryOptions,
	): Promise<RepoResult<Album[]>>;

	/**
	 * Find all albums by a specific genre.
	 * @param genreId Genre ID
	 * @param options Optional query modifiers
	 * @returns Repository result with matching albums.
	 */
	findByGenreId(
		genreId: string,
		options?: QueryOptions,
	): Promise<RepoResult<Album[]>>;

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
	findWithRelationsById(
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
	findTracksWithRelationsByAlbumId(
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
	 * Bulk create multiple albums.
	 * @param albums Array of album creation data
	 * @returns Repository result with the created albums.
	 */
	createMany(albums: CreateAlbum[]): Promise<RepoResult<Album[]>>;

	// -----------------------------
	// Updates
	// -----------------------------
	/**
	 * Update an existing album.
	 * @param updateData Album update payload
	 * @returns Repository result with the updated album.
	 */
	update(updateData: UpdateAlbum): Promise<RepoResult<Album>>;

	// -----------------------------
	// Deletion
	// -----------------------------
	/**
	 * Delete an album permanently.
	 * @param id Album ID
	 * @returns Repository result of the deletion operation.
	 */
	delete(id: string): Promise<RepoResult>;

	/**
	 * Bulk delete multiple albums permanently.
	 * @param ids Array of album IDs
	 * @returns Repository result of the deletion operation.
	 */
	deleteMany(ids: string[]): Promise<RepoResult>;

	// -----------------------------
	// Track Management
	// -----------------------------
	/**
	 * Add a single track to an album at a specific order.
	 * @param albumId Album ID
	 * @param trackId Track ID
	 * @param order Position of the track in the album
	 * @returns Repository result of the addition operation
	 */
	addTrack(
		albumId: string,
		trackId: string,
		order: number,
	): Promise<RepoResult>;

	/**
	 * Add multiple tracks to an album with specified order positions.
	 * @param albumId Album ID
	 * @param trackIds Array of track Ids (Index Order is used to set the order)
	 * @returns Repository result of the addition operation
	 */
	addTracks(albumId: string, tracksIds: string[]): Promise<RepoResult>;

	/**
	 * Remove a single track from an album.
	 * @param albumId Album ID
	 * @param trackId Track ID to remove
	 * @returns Repository result of the removal operation
	 */
	removeTrack(albumId: string, trackId: string): Promise<RepoResult>;

	/**
	 * Remove multiple tracks from an album.
	 * @param albumId Album ID
	 * @param trackIds Array of track IDs to remove
	 * @returns Repository result of the removal operation
	 */
	removeTracks(albumId: string, trackIds: string[]): Promise<RepoResult>;

	/**
	 * Reorder tracks in an album.
	 * @param albumId Album ID
	 * @param orderedTrackIds Array of track IDs in the new order
	 * @returns Repository result of the reorder operation.
	 */
	reorderTracks(
		albumId: string,
		orderedTrackIds: string[],
	): Promise<RepoResult>;

	// -----------------------------
	// Counts / Aggregates
	// -----------------------------
	/**
	 * Fetch the total number of albums.
	 * @returns Repository result with the album count.
	 */
	count(): Promise<RepoResult<number>>;

	/**
	 * Count albums by a specific artist.
	 * @param artistId Artist ID
	 * @returns Repository result with album count.
	 */
	countByArtist(artistId: string): Promise<RepoResult<number>>;

	/**
	 * Count albums by a specific genre.
	 * @param genreId Genre ID
	 * @returns Repository result with album count.
	 */
	countByGenre(genreId: string): Promise<RepoResult<number>>;
}
