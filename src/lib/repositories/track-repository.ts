import type { SupabaseClient } from "@supabase/supabase-js";
import { mapTrack } from "@/lib/mappers/map-track";
import type { Database } from "@/types/supabase";
import type { Track } from "@/types/track";

export interface ITrackRepository {
	findAll(): Promise<Track[] | null>;

	findById(id: string): Promise<Track>;
}

export class TrackRepository implements ITrackRepository {
	constructor(private supabase: SupabaseClient<Database>) {}

	async findAll() {
		const { data, error } = await this.supabase
			.from("tracks")
			.select("*, genres!inner(*)");

		if (error) throw error;

		return data?.map((track) => mapTrack(track));
	}

	async findById(id: string) {
		const { data, error } = await this.supabase
			.from("tracks")
			.select("*, genres!inner(*)")
			.eq("id", id)
			.single();

		if (error) throw error;

		return mapTrack(data);
	}
}
