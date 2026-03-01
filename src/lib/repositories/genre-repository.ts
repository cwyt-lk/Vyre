import type { SupabaseClient } from "@supabase/supabase-js";
import { mapGenre } from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import type { CreateGenre, Genre } from "@/types/domain";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

export interface GenreRepositoryContract {
	findAll(): Promise<RepoResult<Genre[]>>;

	findById(id: string): Promise<RepoResult<Genre>>;

	create(genre: CreateGenre): Promise<RepoResult>;
}

export class GenreRepository implements GenreRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	async findAll(): Promise<RepoResult<Genre[]>> {
		const { data, error } = await this.supabase
			.from("genres")
			.select("*");

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: data.map(mapGenre),
		};
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

		return { success: true, data: mapGenre(data) };
	}

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
