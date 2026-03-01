import type { SupabaseClient } from "@supabase/supabase-js";
import { mapTrack } from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import type { Track } from "@/types/domain";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

const TRACK_SELECT_QUERY = "*, genres!inner(*)";

export interface TrackRepositoryContract {
	findAll(): Promise<RepoResult<Track[]>>;

	findById(id: string): Promise<RepoResult<Track>>;
}

export class TrackRepository implements TrackRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	async findAll(): Promise<RepoResult<Track[]>> {
		const { data, error } = await this.supabase
			.from("tracks")
			.select(TRACK_SELECT_QUERY);

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: data.map(mapTrack).filter((a): a is Track => !!a),
		};
	}

	async findById(id: string): Promise<RepoResult<Track>> {
		const { data, error } = await this.supabase
			.from("tracks")
			.select(TRACK_SELECT_QUERY)
			.eq("id", id)
			.single();

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: mapTrack(data) };
	}
}
