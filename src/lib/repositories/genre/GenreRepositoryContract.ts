import type { QueryOptions } from "@/lib/repositories/query-options";
import type { CreateGenre, Genre, UpdateGenre } from "@/types/domain";
import type { RepoResult } from "@/types/results";

/**
 * Contract defining all operations for genre persistence.
 *
 * Includes CRUD operations, bulk operations, soft deletes,
 * existence checks, and counts.
 */
export interface GenreRepositoryContract {
	// -----------------------------
	// Existence Checks
	// -----------------------------

	/**
	 * Check if a genre exists.
	 * @param id Genre ID
	 * @returns Repository result with boolean indicating existence.
	 */
	exists(id: string): Promise<RepoResult<boolean>>;

	// -----------------------------
	// Fetching / Querying
	// -----------------------------

	/**
	 * Fetch all genres.
	 * @param options Optional query modifiers (pagination, filtering, etc.)
	 * @returns Repository result containing an array of genres.
	 */
	findAll(options?: QueryOptions): Promise<RepoResult<Genre[]>>;

	/**
	 * Fetch a single genre by its unique identifier.
	 * @param id Genre ID
	 * @returns Repository result with the genre if found.
	 */
	findById(id: string): Promise<RepoResult<Genre>>;

	// -----------------------------
	// Creation
	// -----------------------------

	/**
	 * Create a new genre.
	 * @param genre Genre creation data
	 * @returns Repository result with the newly created genre.
	 */
	create(genre: CreateGenre): Promise<RepoResult<Genre>>;

	// -----------------------------
	// Updates
	// -----------------------------

	/**
	 * Update an existing genre.
	 * @param updateData Genre update payload
	 * @returns Repository result with the updated genre.
	 */
	update(updateData: UpdateGenre): Promise<RepoResult<Genre>>;

	// -----------------------------
	// Deletion
	// -----------------------------

	/**
	 * Permanently delete a genre.
	 * @param id Genre ID
	 * @returns Repository result of the deletion operation.
	 */
	delete(id: string): Promise<RepoResult>;

	// -----------------------------
	// Counts / Aggregates
	// -----------------------------

	/**
	 * Fetch the total number of genres.
	 * @returns Repository result with genre count.
	 */
	count(): Promise<RepoResult<number>>;
}
