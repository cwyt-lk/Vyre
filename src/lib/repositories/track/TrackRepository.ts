import type { SupabaseClient } from "@supabase/supabase-js";
import {
	ArtistMapper,
	type TrackDB,
	TrackMapper,
} from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import {
	applyQueryOptions,
	type QueryOptions,
} from "@/lib/repositories/query-options";
import type { TrackRepositoryContract } from "@/lib/repositories/track";
import { flatMapList } from "@/lib/utils/array";
import type {
	Artist,
	CreateTrack,
	Track,
	TrackAggregate,
	UpdateTrack,
} from "@/types/domain";
import { VyreError } from "@/types/errors";
import type {
	ActionResult,
	RepoListResult,
	RepoResult,
} from "@/types/results";
import type { Database } from "@/types/supabase";

const TRACK_RELATION_SELECT = `
  *,
  genres (*),
  track_artists (*, artists (*))
`;

export class TrackRepository implements TrackRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	// -----------------------------
	// Existence Checks
	// -----------------------------

	async exists(id: string): Promise<RepoResult<boolean>> {
		const { count, error } = await this.supabase
			.from("tracks")
			.select("id", { count: "exact", head: true })
			.eq("id", id);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true, data: count ? count > 0 : false };
	}

	// -----------------------------
	// Fetching / Querying
	// -----------------------------

	async findAll(options?: QueryOptions): Promise<RepoResult<Track[]>> {
		const { data, error } = await applyQueryOptions(
			this.supabase.from("tracks").select("*"),
			options,
		);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return {
			success: true,
			data: flatMapList(data, TrackMapper.map),
		};
	}

	async findById(id: string): Promise<RepoResult<Track>> {
		const { data, error } = await this.supabase
			.from("tracks")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true, data: TrackMapper.map(data) };
	}

	async findAllWithRelations(
		options?: QueryOptions,
	): Promise<RepoResult<TrackAggregate[]>> {
		const { data, error } = await applyQueryOptions(
			this.supabase.from("tracks").select(TRACK_RELATION_SELECT),
			options,
		);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return {
			success: true,
			data: flatMapList(data, TrackMapper.mapWithRelations),
		};
	}

	async findByIdWithRelations(
		id: string,
	): Promise<RepoResult<TrackAggregate>> {
		const { data, error } = await this.supabase
			.from("tracks")
			.select(TRACK_RELATION_SELECT)
			.eq("id", id)
			.single();

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return {
			success: true,
			data: TrackMapper.mapWithRelations(data),
		};
	}

	async searchByTitleWithRelations(
		title: string,
		options?: QueryOptions,
	): Promise<RepoListResult<TrackAggregate>> {
		const query = applyQueryOptions(
			this.supabase
				.from("tracks")
				.select(TRACK_RELATION_SELECT, { count: "exact" })
				.ilike("title", `%${title}%`),
			options,
		);

		const { count, data, error } = await query;

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: {
				items: flatMapList(data, TrackMapper.mapWithRelations),
				count: count ?? 0,
			},
		};
	}

	async findArtists(
		trackId: string,
		options?: QueryOptions,
	): Promise<RepoResult<Artist[]>> {
		const { data, error } = await applyQueryOptions(
			this.supabase
				.from("track_artists")
				.select("artists (*)")
				.eq("track_id", trackId),

			options,
		);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return {
			success: true,
			data: flatMapList(
				data.map((it) => it.artists),
				ArtistMapper.map,
			),
		};
	}

	// -----------------------------
	// Creation
	// -----------------------------

	async create(track: CreateTrack): Promise<RepoResult<Track>> {
		const { data, error } = await this.supabase
			.from("tracks")
			.insert({
				title: track.title,
				genre_id: track.genreId,
				audio_path: track.audioPath,
			})
			.select()
			.single();

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true, data: TrackMapper.map(data) };
	}

	async createTrackWithArtists(
		createData: CreateTrack,
	): Promise<RepoResult<Track>> {
		const { data, error } = await this.supabase.rpc(
			"create_track_with_artists",
			{
				p_title: createData.title,
				p_genre_id: createData.genreId,
				p_audio_path: createData.audioPath,
				p_artist_ids: createData.artistIds,
			},
		);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		const trackData = data as ActionResult<TrackDB>;

		if (!trackData.success) {
			return {
				success: false,
				error: new VyreError(trackData.error, "RPC_ERROR"),
			};
		}

		return {
			success: true,
			data: TrackMapper.map(trackData.data),
		};
	}

	// -----------------------------
	// Updates
	// -----------------------------

	async update(updateData: UpdateTrack): Promise<RepoResult<Track>> {
		const { error, data } = await this.supabase
			.from("tracks")
			.update({
				title: updateData.title,
				genre_id: updateData.genreId,
				audio_path: updateData.audioPath,
			})
			.eq("id", updateData.id)
			.select()
			.single();

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true, data: TrackMapper.map(data) };
	}

	async updateTrackWithArtists(
		updateData: UpdateTrack,
	): Promise<RepoResult> {
		const { data, error } = await this.supabase.rpc(
			"update_track_with_artists",
			{
				p_id: updateData.id,
				p_title: updateData.title,
				p_genre_id: updateData.genreId,
				p_audio_path: updateData.audioPath,
				p_artist_ids: updateData.artistIds,
			},
		);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		const trackData = data as ActionResult<TrackDB>;

		if (!trackData.success) {
			return {
				success: false,
				error: new VyreError(trackData.error, "RPC_ERROR"),
			};
		}

		return { success: true };
	}

	// -----------------------------
	// Deletion
	// -----------------------------

	async delete(id: string): Promise<RepoResult> {
		const { error } = await this.supabase
			.from("tracks")
			.delete()
			.eq("id", id);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true };
	}

	// -----------------------------
	// Counts / Aggregates
	// -----------------------------

	async count(): Promise<RepoResult<number>> {
		const { count, error } = await this.supabase
			.from("tracks")
			.select("id", { count: "exact", head: true });

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true, data: count ?? 0 };
	}

	async countByArtist(artistId: string): Promise<RepoResult<number>> {
		const { count, error } = await this.supabase
			.from("track_artists")
			.select("track_id", { count: "exact", head: true })
			.eq("artist_id", artistId);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		return { success: true, data: count ?? 0 };
	}
}
