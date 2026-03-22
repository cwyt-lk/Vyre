import type { SupabaseClient } from "@supabase/supabase-js";
import { ArtistMapper } from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import type { ArtistRepositoryContract } from "@/lib/repositories/artist";
import {
	applyQueryOptions,
	type QueryOptions,
} from "@/lib/repositories/query-options";
import { flatMapList } from "@/lib/utils/array";
import type { Artist, CreateArtist } from "@/types/domain";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

/**
 * Supabase-backed repository for artist persistence.
 */
export class ArtistRepository implements ArtistRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	/** @inheritdoc ArtistRepositoryContract.findAll */
	async findAll(options?: QueryOptions): Promise<RepoResult<Artist[]>> {
		const baseQuery = this.supabase.from("artists").select("*");
		const query = applyQueryOptions(baseQuery, options);

		const { data, error } = await query;

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: flatMapList(data, ArtistMapper.map),
		};
	}

	/** @inheritdoc ArtistRepositoryContract.findById */
	async findById(id: string): Promise<RepoResult<Artist>> {
		const { data, error } = await this.supabase
			.from("artists")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: ArtistMapper.map(data) };
	}

	/** @inheritdoc ArtistRepositoryContract.create */
	async create(data: CreateArtist): Promise<RepoResult<Artist>> {
		const { data: insertedData, error } = await this.supabase
			.from("artists")
			.insert(data)
			.select()
			.single();

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: ArtistMapper.map(insertedData) };
	}
}
