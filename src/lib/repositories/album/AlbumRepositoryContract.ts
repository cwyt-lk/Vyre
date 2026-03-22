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
import type { RepoResult } from "@/types/results";

/**
 * Repository contract for album persistence operations.
 * Abstracts database access and maps raw rows into domain models.
 */
export interface AlbumRepositoryContract {
	/**
	 * Fetch all albums without related entities
	 * @param options - Query Options
	 */
	findAll(options?: QueryOptions): Promise<RepoResult<Album[]>>;

	/** Fetch a single album by its unique identifier
	 * @param id - Album ID
	 */
	findById(id: string): Promise<RepoResult<Album>>;

	/** Search albums by title prefix (case-insensitive)
	 * @param title - Album title prefix
	 * @param options - Query Options
	 */
	searchByTitle(
		title: string,
		options?: QueryOptions,
	): Promise<RepoResult<Album[]>>;

	/** Retrieve tracks belonging to an album (without relations)
	 * @param id - Album ID
	 * @param options - Query Options
	 */
	findTracksByAlbumId(
		id: string,
		options?: QueryOptions,
	): Promise<RepoResult<Track[]>>;

	/** Retrieve tracks for an album with their relations
	 *
	 * Includes:
	 * - Genres
	 * - Track artists
	 * - Artist information
	 *
	 * @param id - Album ID
	 * @param options - Query Options
	 */
	findTracksWithRelationsByAlbumId(
		id: string,
		options?: QueryOptions,
	): Promise<RepoResult<TrackAggregate[]>>;

	/**
	 * Fetch all albums with nested track relations
	 * @param options - Query Options
	 */
	findAllWithRelations(
		options?: QueryOptions,
	): Promise<RepoResult<AlbumAggregate[]>>;

	/** Fetch a single album with all nested relations
	 *
	 * Includes:
	 * - Album metadata
	 * - Album tracks
	 * - Track relations (genres, artists)
	 *
	 * @param id - Album ID
	 */
	findWithRelationsById(
		id: string,
	): Promise<RepoResult<AlbumFullAggregate>>;

	/**
	 * Fetches the total number of rows
	 */
	count(): Promise<RepoResult<number>>;

	/** Create a new album
	 * @param album - Album creation data
	 */
	create(album: CreateAlbum): Promise<RepoResult<Album>>;

	/** Delete an album
	 * @param id - Album ID
	 */
	delete(id: string): Promise<RepoResult>;

	/** Update an album
	 * @param updateData - Album Data for updating (Partial)
	 */
	update(updateData: UpdateAlbum): Promise<RepoResult<Album>>;

	/** Add a track to an album
	 * @param albumId - Album ID
	 * @param trackId - Track ID
	 * @param order - Track position in the album
	 */
	addTrack(
		albumId: string,
		trackId: string,
		order: number,
	): Promise<RepoResult>;

	/** Remove a track from an album
	 * @param albumId - Album ID
	 * @param trackIds - List of Track IDs
	 */
	removeTracks(albumId: string, trackIds: string[]): Promise<RepoResult>;
}
