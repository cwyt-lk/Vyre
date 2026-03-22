import type { SupabaseClient } from "@supabase/supabase-js";
import { GenreMapper } from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import type { GenreRepositoryContract } from "@/lib/repositories/genre";
import {
	applyQueryOptions,
	type QueryOptions,
} from "@/lib/repositories/query-options";
import { flatMapList } from "@/lib/utils/array";
import type { CreateGenre, Genre } from "@/types/domain";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

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

	/** @inheritDoc GenreRepositoryContract.findAll */
	async findAll(options?: QueryOptions): Promise<RepoResult<Genre[]>> {
		const baseQuery = this.supabase.from("genres").select("*");
		const query = applyQueryOptions(baseQuery, options);

		const { data, error } = await query;

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: flatMapList(data, GenreMapper.map) };
	}

	/** @inheritDoc GenreRepositoryContract.findById */
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

	/** @inheritDoc GenreRepositoryContract.create */
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
