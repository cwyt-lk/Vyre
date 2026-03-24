import type { SupabaseClient } from "@supabase/supabase-js";
import { ArtistMapper } from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import type { ArtistRepositoryContract } from "@/lib/repositories/artist";
import {
	applyQueryOptions,
	type QueryOptions,
} from "@/lib/repositories/query-options";
import { flatMapList } from "@/lib/utils/array";
import type { Artist, CreateArtist, UpdateArtist } from "@/types/domain";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

/**
 * Supabase-backed repository for artist persistence.
 */
export class ArtistRepository implements ArtistRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	// -----------------------------
	// Existence Checks
	// -----------------------------

	async exists(id: string): Promise<RepoResult<boolean>> {
		const { count, error } = await this.supabase
			.from("artists")
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

	// -----------------------------\
	// Creation
	// -----------------------------\

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

	async createMany(data: CreateArtist[]): Promise<RepoResult<Artist[]>> {
		const { data: inserted, error } = await this.supabase
			.from("artists")
			.insert(data)
			.select();

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: flatMapList(inserted, ArtistMapper.map),
		};
	}

	// -----------------------------\
	// Updates
	// -----------------------------\

	async update(updateData: UpdateArtist): Promise<RepoResult<Artist>> {
		const { data, error } = await this.supabase
			.from("artists")
			.update(updateData)
			.eq("id", updateData.id)
			.select()
			.single();

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: ArtistMapper.map(data) };
	}

	// -----------------------------\
	// Deletion
	// -----------------------------\

	async delete(id: string): Promise<RepoResult> {
		const { error } = await this.supabase
			.from("artists")
			.delete()
			.eq("id", id);

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true };
	}

	async deleteMany(ids: string[]): Promise<RepoResult> {
		const { error } = await this.supabase
			.from("artists")
			.delete()
			.in("id", ids);

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true };
	}

	// -----------------------------\
	// Counts / Aggregates
	// -----------------------------\

	async count(): Promise<RepoResult<number>> {
		const { count, error } = await this.supabase
			.from("artists")
			.select("id", { count: "exact", head: true });

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: count ?? 0 };
	}
}
