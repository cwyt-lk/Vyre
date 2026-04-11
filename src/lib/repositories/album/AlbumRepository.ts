import type { SupabaseClient } from "@supabase/supabase-js";
import {
	type AlbumDB,
	AlbumMapper,
	TrackMapper,
} from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import type { AlbumRepositoryContract } from "@/lib/repositories/album";
import {
	applyQueryOptions,
	type QueryOptions,
} from "@/lib/repositories/query-options";
import { flatMapList } from "@/lib/utils/array";
import type {
	Album,
	AlbumFullAggregate,
	CreateAlbum,
	Track,
	TrackAggregate,
	UpdateAlbum,
} from "@/types/domain";
import { VyreError } from "@/types/errors";
import type {
	ActionResult,
	RepoListResult,
	RepoResult,
} from "@/types/results";
import type { Database } from "@/types/supabase";

const TRACK_RELATION_SELECT = `
  tracks (
    *,
    genres (*),
    track_artists (*, artists (*))
  )
`;

const ALBUM_RELATION_SELECT = `
  *,
  album_tracks (
    ${TRACK_RELATION_SELECT}
  )
`;

/**
 * Implementation of the AlbumRepositoryContract using Supabase as the data source.
 */
export class AlbumRepository implements AlbumRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	// -----------------------------
	// Existence Checks
	// -----------------------------

	async exists(id: string): Promise<RepoResult<boolean>> {
		const { count, error } = await this.supabase
			.from("albums")
			.select("id", { count: "exact", head: true })
			.eq("id", id);

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: (count ?? 0) > 0 };
	}

	// -----------------------------
	// Fetching / Querying
	// -----------------------------

	async findAll(options?: QueryOptions): Promise<RepoResult<Album[]>> {
		const query = applyQueryOptions(
			this.supabase.from("albums").select("*"),
			options,
		);

		const { data, error } = await query;

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: flatMapList(data, AlbumMapper.map) };
	}

	async findById(id: string): Promise<RepoResult<Album>> {
		const { data, error } = await this.supabase
			.from("albums")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: AlbumMapper.map(data) };
	}

	async searchByTitle(
		title: string,
		options?: QueryOptions,
	): Promise<RepoListResult<Album>> {
		const query = applyQueryOptions(
			this.supabase
				.from("albums")
				.select("*", { count: "exact" })
				.ilike("title", `${title}%`),

			options,
		);

		const { count, data, error } = await query;

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: {
				items: flatMapList(data, AlbumMapper.map),
				count: count ?? 0,
			},
		};
	}

	async findAllWithRelations(
		options?: QueryOptions,
	): Promise<RepoResult<AlbumFullAggregate[]>> {
		const query = applyQueryOptions(
			this.supabase
				.from("albums")
				.select(ALBUM_RELATION_SELECT)
				.order("track_number", {
					referencedTable: "album_tracks",
					ascending: true,
				}),

			options,
		);

		const { data, error } = await query;

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: flatMapList(data, AlbumMapper.mapWithDetailedRelations),
		};
	}

	async findByIdWithRelations(
		id: string,
	): Promise<RepoResult<AlbumFullAggregate>> {
		const { data, error } = await this.supabase
			.from("albums")
			.select(ALBUM_RELATION_SELECT)
			.order("track_number", {
				referencedTable: "album_tracks",
				ascending: true,
			})
			.eq("id", id)
			.single();

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: AlbumMapper.mapWithDetailedRelations(data),
		};
	}

	async findTracksByAlbumId(
		id: string,
		options?: QueryOptions,
	): Promise<RepoResult<Track[]>> {
		const query = applyQueryOptions(
			this.supabase
				.from("album_tracks")
				.select("tracks (*)")
				.eq("album_id", id)
				.order("track_number", { ascending: true }),

			options,
		);

		const { data, error } = await query;

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: flatMapList(data, (item) =>
				TrackMapper.map(item.tracks),
			),
		};
	}

	async findTracksByAlbumIdWithRelations(
		id: string,
		options?: QueryOptions,
	): Promise<RepoResult<TrackAggregate[]>> {
		const query = applyQueryOptions(
			this.supabase
				.from("album_tracks")
				.select(TRACK_RELATION_SELECT)
				.eq("album_id", id)
				.order("track_number", { ascending: true }),

			options,
		);

		const { data, error } = await query;

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: flatMapList(data, (item) =>
				TrackMapper.mapWithRelations(item.tracks),
			),
		};
	}

	// -----------------------------
	// Creation
	// -----------------------------

	async create(album: CreateAlbum): Promise<RepoResult<Album>> {
		const { data, error } = await this.supabase
			.from("albums")
			.insert({
				title: album.title,
				description: album.description,
				release_date: album.releaseDate.toISOString(),
				cover_path: album.coverPath,
			})
			.select()
			.single();

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: AlbumMapper.map(data) };
	}

	async createAlbumWithTracks(
		createData: CreateAlbum,
	): Promise<RepoResult<Album>> {
		const { data, error } = await this.supabase.rpc(
			"create_album_with_tracks",
			{
				p_title: createData.title,
				p_description: createData.description,
				p_release_date: createData.releaseDate.toISOString(),
				p_cover_path: createData.coverPath ?? undefined,
				p_track_ids: createData.trackIds,
			},
		);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		const albumData = data as ActionResult<AlbumDB>;

		if (!albumData.success) {
			return {
				success: false,
				error: new VyreError(albumData.error, "RPC_ERROR"),
			};
		}

		return {
			success: true,
			data: AlbumMapper.map(albumData.data),
		};
	}

	// -----------------------------
	// Updates
	// -----------------------------

	async update(updateData: UpdateAlbum): Promise<RepoResult<Album>> {
		const { data, error } = await this.supabase
			.from("albums")
			.update({
				title: updateData.title,
				description: updateData.description,
				release_date: updateData.releaseDate?.toISOString(),
				cover_path: updateData.coverPath,
			})
			.eq("id", updateData.id)
			.select()
			.single();

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: AlbumMapper.map(data) };
	}

	async updateAlbumWithTracks(
		updateData: UpdateAlbum,
	): Promise<RepoResult> {
		const { data, error } = await this.supabase.rpc(
			"update_album_with_tracks",
			{
				p_id: updateData.id,
				p_title: updateData.title,
				p_description: updateData.description,
				p_release_date: updateData.releaseDate?.toISOString(),
				p_cover_path: updateData.coverPath ?? undefined,
				p_track_ids: updateData.trackIds,
			},
		);

		if (error) {
			return {
				success: false,
				error: mapPostgresError(error),
			};
		}

		const albumData = data as ActionResult<AlbumDB>;

		if (!albumData.success) {
			return {
				success: false,
				error: new VyreError(albumData.error, "RPC_ERROR"),
			};
		}

		return { success: true };
	}

	// -----------------------------
	// Deletion
	// -----------------------------

	async delete(id: string): Promise<RepoResult> {
		const { error } = await this.supabase
			.from("albums")
			.delete()
			.eq("id", id);

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true };
	}

	// -----------------------------
	// Counts / Aggregates
	// -----------------------------

	async count(): Promise<RepoResult<number>> {
		const { count, error } = await this.supabase
			.from("albums")
			.select("id", { count: "exact", head: true });

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: count ?? -1 };
	}
}
