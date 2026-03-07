import type { SupabaseClient } from "@supabase/supabase-js";
import { GenreMapper } from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import { flatMapList } from "@/lib/utils/array";
import type { CreateGenre, Genre } from "@/types/domain";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

/**
 * Contract describing persistence operations available for genres.
 *
 * Implementations are responsible for retrieving and storing genre data
 * from the underlying data source and mapping it into domain models.
 */
export interface GenreRepositoryContract {
	/**
	 * Retrieve all genres.
	 */
	findAll(): Promise<RepoResult<Genre[]>>;

	/**
	 * Retrieve a single genre by its unique identifier.
	 *
	 * @param id - Genre ID
	 */
	findById(id: string): Promise<RepoResult<Genre>>;

	/**
	 * Create a new genre.
	 *
	 * @param genre - Genre creation data
	 */
	create(genre: CreateGenre): Promise<RepoResult>;
}

/**
 * Supabase-backed repository responsible for genre persistence.
 *
 * This class:
 * - Executes database queries against Supabase
 * - Maps raw database rows into domain models
 * - Normalizes database errors into `RepoResult`
 */
export class GenreRepository implements GenreRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	/**
	 * Fetch all genres from the database.
	 */
	async findAll(): Promise<RepoResult<Genre[]>> {
		const { data, error } = await this.supabase
			.from("genres")
			.select("*");

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: flatMapList(data, GenreMapper.map),
		};
	}

	/**
	 * Fetch a single genre by ID.
	 *
	 * @param id - Genre ID
	 */
	async findById(id: string): Promise<RepoResult<Genre>> {
		const { data, error } = await this.supabase
			.from("genres")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: GenreMapper.map(data) };
	}

	/**
	 * Insert a new genre into the database.
	 *
	 * @param genre - Genre creation payload containing key and label
	 */
	async create(genre: CreateGenre): Promise<RepoResult> {
		const { error } = await this.supabase.from("genres").insert({
			key: genre.key,
			label: genre.label,
		});

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true };
	}
}
