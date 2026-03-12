import type { SupabaseClient } from "@supabase/supabase-js";
import { ArtistMapper } from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import { flatMapList } from "@/lib/utils/array";
import type { Artist, CreateArtist } from "@/types/domain";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

/**
 * Repository contract defining persistence operations for artists.
 *
 * Abstracts data access and maps database rows into domain models.
 */
export interface ArtistRepositoryContract {
	/** Fetch all artists */
	findAll(): Promise<RepoResult<Artist[]>>;

	/** Fetch a single artist by ID
	 * @param id - Artist unique identifier
	 */
	findById(id: string): Promise<RepoResult<Artist>>;

	/** Create a new artist
	 * @param data - Artist creation data
	 */
	create(data: CreateArtist): Promise<RepoResult>;
}

/**
 * Supabase-backed repository for artist persistence.
 *
 * Handles:
 * - Executing Supabase queries
 * - Mapping raw rows into domain models
 * - Normalizing database errors into `RepoResult`
 */
export class ArtistRepository implements ArtistRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	/** {@inheritDoc ArtistRepositoryContract.findAll} */
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

	/** {@inheritDoc ArtistRepositoryContract.findById} */
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

	/** {@inheritDoc ArtistRepositoryContract.create} */
	async create(data: CreateArtist): Promise<RepoResult> {
		const { error } = await this.supabase.from("artists").insert(data);

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true };
	}
}
