import type { SupabaseClient } from "@supabase/supabase-js";
import { mapGenre } from "@/lib/mappers/map-genre";
import type { Genre } from "@/types/domain/genre";
import type { Database } from "@/types/supabase";

export interface GenreRepositoryContract {
	findAll(): Promise<{
		data: Genre[] | null;
		error: Error | null;
	}>;

	findById(id: string): Promise<{
		data: Genre | null;
		error: Error | null;
	}>;
}

export class GenreRepository implements GenreRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	async findAll() {
		const { data, error } = await this.supabase
			.from("genres")
			.select("*");

		if (error) {
			return { data: null, error };
		}

		return {
			data: data?.map((genre) => mapGenre(genre)) ?? null,
			error: null,
		};
	}

	async findById(id: string) {
		const { data, error } = await this.supabase
			.from("genres")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			return { data: null, error };
		}

		return {
			data: data ? mapGenre(data) : null,
			error: null,
		};
	}
}
