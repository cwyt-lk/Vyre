import type { SupabaseClient } from "@supabase/supabase-js";
import { AlbumMapper, TrackMapper } from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
import type { AlbumRepositoryContract } from "@/lib/repositories/album";
import {
	applyQueryOptions,
	type QueryOptions,
} from "@/lib/repositories/query-options";
import { flatMapList } from "@/lib/utils/array";
import type {
	Album,
	AlbumAggregate,
	AlbumFullAggregate,
	CreateAlbum,
	Track,
	TrackAggregate,
	UpdateAlbum,
} from "@/types/domain";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

/**
 * Supabase select fragment to fetch tracks with their related entities.
 *
 * Includes:
 * - Track fields
 * - Genres
 * - Track artists
 * - Artist information
 */
const TRACK_RELATION_SELECT = `
  tracks (
    *,
    genres (*),
    track_artists (*, artists (*))
  )
`;

/**
 * Supabase select fragment to fetch albums with nested tracks and
 * all nested track relations.
 */
const ALBUM_RELATION_SELECT = `
  *,
  album_tracks (
    ${TRACK_RELATION_SELECT}
  )
`;

/**
 * Supabase-backed repository for album persistence.
 *
 * Handles:
 * - Database queries
 * - Mapping raw database rows into domain models
 * - Normalizing errors into RepoResult format
 */
export class AlbumRepository implements AlbumRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	/** @inheritDoc AlbumRepositoryContract.findAll */
	async findAll(options?: QueryOptions): Promise<RepoResult<Album[]>> {
		const baseQuery = this.supabase.from("albums").select("*");
		const query = applyQueryOptions(baseQuery, options);

		const { data, error } = await query;

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: flatMapList(data, AlbumMapper.map) };
	}

	/** @inheritDoc AlbumRepositoryContract.findById */
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

	/** @inheritDoc AlbumRepositoryContract.searchByTitle */
	async searchByTitle(
		title: string,
		options?: QueryOptions,
	): Promise<RepoResult<Album[]>> {
		const baseQuery = this.supabase
			.from("albums")
			.select("*")
			.ilike("title", `${title}%`);

		const query = applyQueryOptions(baseQuery, options);

		const { data, error } = await query;

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: flatMapList(data, AlbumMapper.map) };
	}

	/** @inheritDoc AlbumRepositoryContract.findTracksByAlbumId */
	async findTracksByAlbumId(
		id: string,
		options?: QueryOptions,
	): Promise<RepoResult<Track[]>> {
		const baseQuery = this.supabase
			.from("album_tracks")
			.select("tracks (*)")
			.eq("album_id", id);

		const query = applyQueryOptions(baseQuery, options);

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

	/** @inheritDoc AlbumRepositoryContract.findTracksWithRelationsByAlbumId */
	async findTracksWithRelationsByAlbumId(
		id: string,
		options?: QueryOptions,
	): Promise<RepoResult<TrackAggregate[]>> {
		const baseQuery = this.supabase
			.from("album_tracks")
			.select(TRACK_RELATION_SELECT)
			.eq("album_id", id);

		const query = applyQueryOptions(baseQuery, options);

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

	/** @inheritDoc AlbumRepositoryContract.findAllWithRelations */
	async findAllWithRelations(
		options?: QueryOptions,
	): Promise<RepoResult<AlbumAggregate[]>> {
		const baseQuery = this.supabase
			.from("albums")
			.select(ALBUM_RELATION_SELECT);

		const query = applyQueryOptions(baseQuery, options);

		const { data, error } = await query;

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: flatMapList(data, AlbumMapper.mapWithDetailedRelations),
		};
	}

	/** @inheritDoc AlbumRepositoryContract.findWithRelationsById */
	async findWithRelationsById(
		id: string,
	): Promise<RepoResult<AlbumFullAggregate>> {
		const { data, error } = await this.supabase
			.from("albums")
			.select(ALBUM_RELATION_SELECT)
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

	/** @inheritDoc AlbumRepositoryContract.count */
	async count(): Promise<RepoResult<number>> {
		const { count, error } = await this.supabase
			.from("albums")
			.select("id", { count: "exact", head: true });

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: count ?? -1,
		};
	}

	/** @inheritDoc AlbumRepositoryContract.create */
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

	/** @inheritDoc AlbumRepositoryContract.delete */
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

	/** @inheritDoc AlbumRepositoryContract.update */
	async update(updateData: UpdateAlbum): Promise<RepoResult<Album>> {
		const { error, data } = await this.supabase
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

	/** @inheritDoc AlbumRepositoryContract.addTrack */
	async addTrack(
		albumId: string,
		trackId: string,
		order: number,
	): Promise<RepoResult> {
		const { error } = await this.supabase.from("album_tracks").insert({
			album_id: albumId,
			track_id: trackId,
			track_number: order,
		});

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true };
	}

	/** @inheritDoc AlbumRepositoryContract.removeTrack */
	async removeTracks(
		albumId: string,
		trackIds: string[],
	): Promise<RepoResult> {
		const { error } = await this.supabase
			.from("album_tracks")
			.delete()
			.eq("album_id", albumId)
			.in("track_id", trackIds);

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true };
	}
}
