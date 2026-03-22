import type { SupabaseClient } from "@supabase/supabase-js";
import { AlbumMapper, TrackMapper } from "@/lib/mappers/domain";
import { mapPostgresError } from "@/lib/mappers/errors";
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
 * Repository contract for album persistence operations.
 *
 * Abstracts database access and maps raw rows into domain models.
 */
export interface AlbumRepositoryContract {
	/** Fetch all albums without related entities */
	findAll(): Promise<RepoResult<Album[]>>;

	/** Fetch a single album by its unique identifier
	 * @param id - Album ID
	 */
	findById(id: string): Promise<RepoResult<Album>>;

	/** Search albums by title prefix (case-insensitive)
	 * @param title - Album title prefix
	 */
	searchByTitle(title: string): Promise<RepoResult<Album[]>>;

	/** Retrieve tracks belonging to an album (without relations)
	 * @param id - Album ID
	 */
	findTracksByAlbumId(id: string): Promise<RepoResult<Track[]>>;

	/** Retrieve tracks for an album with their relations
	 *
	 * Includes:
	 * - Genres
	 * - Track artists
	 * - Artist information
	 *
	 * @param id - Album ID
	 */
	findTracksWithRelationsByAlbumId(
		id: string,
	): Promise<RepoResult<TrackAggregate[]>>;

	/** Fetch all albums with nested track relations */
	findAllWithRelations(): Promise<RepoResult<AlbumAggregate[]>>;

	/** Fetch a single album with all nested relations
	 *
	 * Includes:
	 * - Album metadata
	 * - Album tracks
	 * - Track relations (genres, artists)
	 *
	 * @param id - Album ID
	 */
	findWithRelationsById(
		id: string,
	): Promise<RepoResult<AlbumFullAggregate>>;

	/** Create a new album
	 * @param album - Album creation data
	 */
	create(album: CreateAlbum): Promise<RepoResult<Album>>;

	/** Delete an album
	 * @param albumId - Album ID
	 */
	delete(albumId: string): Promise<RepoResult>;

	/** Update an album
	 * @param updateData - Album Data for updating (Partial)
	 */
	update(updateData: UpdateAlbum): Promise<RepoResult<Album>>;

	/** Add a track to an album
	 * @param albumId - Album ID
	 * @param trackId - Track ID
	 * @param order - Track position in the album
	 */
	addTrack(
		albumId: string,
		trackId: string,
		order: number,
	): Promise<RepoResult>;

	/** Remove a track from an album
	 * @param albumId - Album ID
	 * @param trackIds - List of Track IDs
	 */
	removeTracks(albumId: string, trackIds: string[]): Promise<RepoResult>;
}

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

	/** {@inheritDoc AlbumRepositoryContract.findAll} */
	async findAll(): Promise<RepoResult<Album[]>> {
		const { data, error } = await this.supabase
			.from("albums")
			.select("*");

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: flatMapList(data, AlbumMapper.map) };
	}

	/** {@inheritDoc AlbumRepositoryContract.findById} */
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

	/** {@inheritDoc AlbumRepositoryContract.searchByTitle} */
	async searchByTitle(title: string): Promise<RepoResult<Album[]>> {
		const { data, error } = await this.supabase
			.from("albums")
			.select("*")
			.ilike("title", `${title}%`);

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true, data: flatMapList(data, AlbumMapper.map) };
	}

	/** {@inheritDoc AlbumRepositoryContract.findTracksByAlbumId} */
	async findTracksByAlbumId(id: string): Promise<RepoResult<Track[]>> {
		const { data, error } = await this.supabase
			.from("album_tracks")
			.select("tracks (*)")
			.eq("album_id", id);

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

	/** {@inheritDoc AlbumRepositoryContract.findTracksWithRelationsByAlbumId} */
	async findTracksWithRelationsByAlbumId(
		id: string,
	): Promise<RepoResult<TrackAggregate[]>> {
		const { data, error } = await this.supabase
			.from("album_tracks")
			.select(TRACK_RELATION_SELECT)
			.eq("album_id", id);

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

	/** {@inheritDoc AlbumRepositoryContract.findAllWithRelations} */
	async findAllWithRelations(): Promise<RepoResult<AlbumAggregate[]>> {
		const { data, error } = await this.supabase
			.from("albums")
			.select(ALBUM_RELATION_SELECT);

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return {
			success: true,
			data: flatMapList(data, AlbumMapper.mapWithDetailedRelations),
		};
	}

	/** {@inheritDoc AlbumRepositoryContract.findWithRelationsById} */
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

	/** {@inheritDoc AlbumRepositoryContract.create} */
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

	/** {@inheritDoc AlbumRepositoryContract.delete} */
	async delete(albumId: string): Promise<RepoResult> {
		const { error } = await this.supabase
			.from("albums")
			.delete()
			.eq("id", albumId);

		if (error) {
			return { success: false, error: mapPostgresError(error) };
		}

		return { success: true };
	}

	/** {@inheritDoc AlbumRepositoryContract.update} */
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

	/** {@inheritDoc AlbumRepositoryContract.addTrack} */
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

	/** {@inheritDoc AlbumRepositoryContract.removeTrack} */
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
