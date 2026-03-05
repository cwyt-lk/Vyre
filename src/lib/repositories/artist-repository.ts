import type { SupabaseClient } from "@supabase/supabase-js";
import { ArtistMapper } from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import { flatMapList } from "@/lib/utils/array";
import type { Artist, CreateArtist } from "@/types/domain";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

/**
 * Contract describing persistence operations available for artists.
 *
 * Implementations are responsible for retrieving artist data
 * from the underlying data source and mapping it into domain models.
 */
export interface ArtistRepositoryContract {
	/**
	 * Retrieve all artists.
	 */
	findAll(): Promise<RepoResult<Artist[]>>;

	/**
	 * Retrieve a single artist by its unique identifier.
	 *
	 * @param id - Artist ID
	 */
	findById(id: string): Promise<RepoResult<Artist>>;

	/**
	 * Creates a single artist
	 *
	 * @param data - The CreateArtist object used for insertion
	 */
	create(data: CreateArtist): Promise<RepoResult>;
}

/**
 * Supabase-backed repository responsible for artist persistence.
 *
 * This class:
 * - Executes database queries against Supabase
 * - Maps raw database rows into domain models
 * - Normalizes database errors into `RepoResult`
 */
export class ArtistRepository implements ArtistRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	/**
	 * Fetch all artists from the database.
	 */
	async findAll(): Promise<RepoResult<Artist[]>> {
		const { data, error } = await this.supabase
			.from("artists")
			.select("*");

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: flatMapList(data, ArtistMapper.map),
		};
	}

	/**
	 * Fetch a single artist by ID.
	 *
	 * @param id - Artist ID
	 */
	async findById(id: string): Promise<RepoResult<Artist>> {
		const { data, error } = await this.supabase
			.from("artists")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: ArtistMapper.map(data) };
	}

	/**
	 * Creates a single artist
	 *
	 * @param data - The CreateArtist object used for insertion
	 */
	async create(data: CreateArtist): Promise<RepoResult> {
		const { error } = await this.supabase.from("artists").insert(data);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true };
	}
}
