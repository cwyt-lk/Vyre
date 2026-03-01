import type { SupabaseClient } from "@supabase/supabase-js";
import { mapTrack } from "@/lib/mappers";
import type { Track } from "@/types/domain";
import type { Database } from "@/types/supabase";

export interface TrackRepositoryContract {
	findAll(): Promise<{
		data: Track[] | null;
		error: Error | null;
	}>;

	findById(id: string): Promise<{
		data: Track | null;
		error: Error | null;
	}>;
}

export class TrackRepository implements TrackRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	async findAll() {
		const { data, error } = await this.supabase
			.from("tracks")
			.select("*, genres!inner(*)");

		if (error) {
			return { data: null, error };
		}

		return {
			data: data?.map((track) => mapTrack(track)) ?? null,
			error: null,
		};
	}

	async findById(id: string) {
		const { data, error } = await this.supabase
			.from("tracks")
			.select("*, genres!inner(*)")
			.eq("id", id)
			.single();

		if (error) {
			return { data: null, error };
		}

		return {
			data: data ? mapTrack(data) : null,
			error: null,
		};
	}
}
