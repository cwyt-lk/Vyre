import type { QueryOptions } from "@/lib/repositories/query-options";
import type { Artist, CreateArtist, UpdateArtist } from "@/types/domain";
import type { RepoListResult, RepoResult } from "@/types/results";

/**
 * Contract defining all operations for artist persistence.
 *
 * Includes CRUD operations, bulk operations, soft deletes,
 * existence checks, and counts.
 */
export interface ArtistRepositoryContract {
	// -----------------------------
	// Existence Checks
	// -----------------------------

	/**
	 * Check if an artist exists.
	 * @param id Artist ID
	 * @returns Repository result with boolean indicating existence.
	 */
	exists(id: string): Promise<RepoResult<boolean>>;

	// -----------------------------
	// Fetching / Querying
	// -----------------------------

	/**
	 * Fetch all artists.
	 * @param options Optional query modifiers (pagination, filtering, etc.)
	 * @returns Repository result containing an array of artists.
	 */
	findAll(options?: QueryOptions): Promise<RepoResult<Artist[]>>;

	/**
	 * Fetch a single artist by its unique identifier.
	 * @param id Artist ID
	 * @returns Repository result with the artist if found.
	 */
	findById(id: string): Promise<RepoResult<Artist>>;

	/**
	 * Searches for an artist by their name.
	 * @param name Artist name
	 * @param options Optional query modifiers (pagination, filtering, etc.)
	 * @returns Repository result with the artists if found.
	 */
	searchByName(
		name: string,
		options?: QueryOptions,
	): Promise<RepoListResult<Artist>>;

	// -----------------------------
	// Creation
	// -----------------------------

	/**
	 * Create a new artist.
	 * @param data Artist creation data
	 * @returns Repository result with the newly created artist.
	 */
	create(data: CreateArtist): Promise<RepoResult<Artist>>;

	// -----------------------------
	// Updates
	// -----------------------------

	/**
	 * Update an existing artist.
	 * @param updateData Artist update payload
	 * @returns Repository result with the updated artist.
	 */
	update(updateData: UpdateArtist): Promise<RepoResult<Artist>>;

	// -----------------------------
	// Deletion
	// -----------------------------

	/**
	 * Permanently delete an artist.
	 * @param id Artist ID
	 * @returns Repository result of the deletion operation.
	 */
	delete(id: string): Promise<RepoResult>;

	// -----------------------------
	// Counts / Aggregates
	// -----------------------------

	/**
	 * Fetch the total number of artists.
	 * @returns Repository result with artist count.
	 */
	count(): Promise<RepoResult<number>>;
}
