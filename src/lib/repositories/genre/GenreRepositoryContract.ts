import type { QueryOptions } from "@/lib/repositories/query-options";
import type { CreateGenre, Genre } from "@/types/domain";
import type { RepoResult } from "@/types/results";

/**
 * Repository contract defining persistence operations for genres.
 *
 * Abstracts data access and maps database rows into domain models.
 */
export interface GenreRepositoryContract {
	/** Fetch all genres */
	findAll(options?: QueryOptions): Promise<RepoResult<Genre[]>>;

	/** Fetch a single genre by ID
	 * @param id - Genre unique identifier
	 */
	findById(id: string): Promise<RepoResult<Genre>>;

	/** Create a new genre
	 * @param genre - Genre creation data
	 */
	create(genre: CreateGenre): Promise<RepoResult>;
}
