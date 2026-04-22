import type { SupabaseClient } from "@supabase/supabase-js";
import { GenreMapper } from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import type { GenreRepositoryContract } from "@/lib/repositories/genre";
import {
	applyQueryOptions,
	type QueryOptions,
} from "@/lib/repositories/query-options";
import { flatMapList } from "@/lib/utils/array";
import type { CreateGenre, Genre, UpdateGenre } from "@/types/domain";
import type { RepoListResult, RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

export class GenreRepository implements GenreRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	// -----------------------------
	// Existence Checks
	// -----------------------------

	async exists(id: string): Promise<RepoResult<boolean>> {
		const { count, error } = await this.supabase
			.from("genres")
			.select("id", { count: "exact", head: true })
			.eq("id", id);

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: count ? count > 0 : false };
	}

	// -----------------------------
	// Fetching / Querying
	// -----------------------------

	async findAll(options?: QueryOptions): Promise<RepoResult<Genre[]>> {
		const { data, error } = await applyQueryOptions(
			this.supabase.from("genres").select("*"),
			options,
		);

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: flatMapList(data, GenreMapper.map) };
	}

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

	async searchByKey(
		key: string,
		options?: QueryOptions,
	): Promise<RepoListResult<Genre>> {
		const query = applyQueryOptions(
			this.supabase
				.from("genres")
				.select("*", { count: "exact" })
				.ilike("key", `%${key}%`),

			options,
		);

		const { data, count, error } = await query;

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return {
			success: true,
			data: {
				items: flatMapList(data, GenreMapper.map),
				count: count ?? 0,
			},
		};
	}

	// -----------------------------
	// Creation
	// -----------------------------

	async create(genre: CreateGenre): Promise<RepoResult<Genre>> {
		const { data, error } = await this.supabase
			.from("genres")
			.insert({
				key: genre.key,
				label: genre.label,
			})
			.select()
			.single();

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: GenreMapper.map(data) };
	}

	// -----------------------------
	// Updates
	// -----------------------------

	async update(updateData: UpdateGenre): Promise<RepoResult<Genre>> {
		const { data, error } = await this.supabase
			.from("genres")
			.update({
				key: updateData.key,
				label: updateData.label,
			})
			.eq("id", updateData.id)
			.select()
			.single();

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: GenreMapper.map(data) };
	}

	// -----------------------------
	// Deletion
	// -----------------------------

	async delete(id: string): Promise<RepoResult> {
		const { error } = await this.supabase
			.from("genres")
			.delete()
			.eq("id", id);

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true };
	}

	// -----------------------------
	// Counts / Aggregates
	// -----------------------------

	async count(): Promise<RepoResult<number>> {
		const { count, error } = await this.supabase
			.from("genres")
			.select("id", { count: "exact", head: true });

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: count ?? 0 };
	}
}
