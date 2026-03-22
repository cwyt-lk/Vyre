import type { QueryOptions } from "@/lib/repositories/query-options";
import type { Artist, CreateArtist } from "@/types/domain";
import type { RepoResult } from "@/types/results";

/**
 * Repository contract defining persistence operations for artists.
 */
export interface ArtistRepositoryContract {
	/** Fetch all artists */
	findAll(options?: QueryOptions): Promise<RepoResult<Artist[]>>;

	/** Fetch a single artist by ID
	 * @param id - Artist unique identifier
	 */
	findById(id: string): Promise<RepoResult<Artist>>;

	/** Create a new artist
	 * @param data - Artist creation data
	 */
	create(data: CreateArtist): Promise<RepoResult<Artist>>;
}
