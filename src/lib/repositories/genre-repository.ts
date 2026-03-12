import type { SupabaseClient } from "@supabase/supabase-js";
import { GenreMapper } from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import { flatMapList } from "@/lib/utils/array";
import type { CreateGenre, Genre } from "@/types/domain";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

/**
 * Repository contract defining persistence operations for genres.
 *
 * Abstracts data access and maps database rows into domain models.
 */
export interface GenreRepositoryContract {
	/** Fetch all genres */
	findAll(): Promise<RepoResult<Genre[]>>;

	/** Fetch a single genre by ID
	 * @param id - Genre unique identifier
	 */
	findById(id: string): Promise<RepoResult<Genre>>;

	/** Create a new genre
	 * @param genre - Genre creation data
	 */
	create(genre: CreateGenre): Promise<RepoResult>;
}

/**
 * Supabase-backed repository for genre persistence.
 *
 * Handles:
 * - Executing Supabase queries
 * - Mapping raw database rows into domain models
 * - Normalizing database errors into `RepoResult`
 */
export class GenreRepository implements GenreRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	/** {@inheritDoc GenreRepositoryContract.findAll} */
	async findAll(): Promise<RepoResult<Genre[]>> {
		const { data, error } = await this.supabase
			.from("genres")
			.select("*");

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: flatMapList(data, GenreMapper.map) };
	}

	/** {@inheritDoc GenreRepositoryContract.findById} */
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

	/** {@inheritDoc GenreRepositoryContract.create} */
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
