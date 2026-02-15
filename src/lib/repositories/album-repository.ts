import type { SupabaseClient } from "@supabase/supabase-js";
import { mapAlbum } from "@/lib/mappers/map-album";
import type { Album } from "@/types/domain/album";
import type { Database } from "@/types/supabase";

export interface IAlbumRepository {
	findAll(): Promise<{
		data: Album[] | null;
		error: Error | null;
	}>;

	findById(id: string): Promise<{
		data: Album | null;
		error: Error | null;
	}>;
}

export class AlbumRepository implements IAlbumRepository {
	constructor(private supabase: SupabaseClient<Database>) {}

	async findAll() {
		const { data, error } = await this.supabase
			.from("albums")
			.select("*, tracks!inner(*, genres!inner(*))");

		if (error) {
			return { data: null, error };
		}

		return {
			data: data?.map((album) => mapAlbum(album)) ?? null,
			error: null,
		};
	}

	async findById(id: string) {
		const { data, error } = await this.supabase
			.from("albums")
			.select("*, tracks!inner(*, genres!inner(*))")
			.eq("id", id)
			.single();

		if (error) {
			return { data: null, error };
		}

		return {
			data: data ? mapAlbum(data) : null,
			error: null,
		};
	}
}
