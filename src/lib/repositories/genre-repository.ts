import type { SupabaseClient } from "@supabase/supabase-js";
import { mapGenre } from "@/lib/mappers/map-genre";
import type { Genre } from "@/types/genre";
import type { Database } from "@/types/supabase";

export interface IGenreRepository {
    findAll(): Promise<Genre[] | null>;

    findById(id: string): Promise<Genre>;
}

export class GenreRepository implements IGenreRepository {
    constructor(private supabase: SupabaseClient<Database>) {
    }

    async findAll() {
        const { data, error } = await this.supabase
            .from("genres")
            .select("*");

        if (error) throw error;

        return data?.map((genre) => mapGenre(genre));
    }

    async findById(id: string) {
        const { data, error } = await this.supabase
            .from("genres")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;

        return mapGenre(data);
    }
}
