import type { SupabaseClient } from "@supabase/supabase-js";
import { mapAlbum } from "@/lib/mappers/map-album";
import type { Album } from "@/types/album";
import type { Database } from "@/types/supabase";

export interface IAlbumRepository {
	findAll(): Promise<Album[] | null>;

	findById(id: string): Promise<Album>;
}

export class AlbumRepository implements IAlbumRepository {
	constructor(private supabase: SupabaseClient<Database>) {}

	async findAll() {
		const { data, error } = await this.supabase
			.from("albums")
			.select("*, tracks!inner(*, genres!inner(*))");

		if (error) throw error;

		return data?.map((album) => mapAlbum(album));
	}

	async findById(id: string) {
		const { data, error } = await this.supabase
			.from("albums")
			.select("*, tracks!inner(*, genres!inner(*))")
			.eq("id", id)
			.single();

		if (error) throw error;

		return mapAlbum(data);
	}
}
