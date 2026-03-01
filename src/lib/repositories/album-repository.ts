import type { SupabaseClient } from "@supabase/supabase-js";
import { mapAlbum } from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import type { Album } from "@/types/domain";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

const ALBUM_SELECT_QUERY = "*, tracks!inner(*, genres!inner(*))";

export interface AlbumRepositoryContract {
	findAll(): Promise<RepoResult<Album[]>>;

	findById(id: string): Promise<RepoResult<Album>>;

	searchByTitle(title: string): Promise<RepoResult<Album[]>>;
}

export class AlbumRepository implements AlbumRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	async findAll(): Promise<RepoResult<Album[]>> {
		const { data, error } = await this.supabase
			.from("albums")
			.select(ALBUM_SELECT_QUERY);

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: data.map(mapAlbum).filter((a): a is Album => !!a),
		};
	}

	async findById(id: string): Promise<RepoResult<Album>> {
		const { data, error } = await this.supabase
			.from("albums")
			.select(ALBUM_SELECT_QUERY)
			.eq("id", id)
			.single();

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: mapAlbum(data) };
	}

	async searchByTitle(title: string): Promise<RepoResult<Album[]>> {
		const { data, error } = await this.supabase
			.from("albums")
			.select(ALBUM_SELECT_QUERY)
			.ilike("title", `${title}%`);

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: data.map(mapAlbum).filter((a): a is Album => !!a),
		};
	}
}
