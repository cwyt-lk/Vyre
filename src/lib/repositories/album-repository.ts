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
} from "@/types/domain";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

/**
 * Supabase select fragment used to fetch tracks with their related entities.
 *
 * Includes:
 * - track fields
 * - genres
 * - track artists
 * - artist information
 */
const TRACK_RELATION_SELECT = `
  tracks (
    *,
    genres (*),
    track_artists (*, artists (*))
  )
`;

/**
 * Supabase select fragment used to fetch albums with their tracks
 * and all nested track relations.
 */
const ALBUM_RELATION_SELECT = `
  *,
  album_tracks (
    ${TRACK_RELATION_SELECT}
  )
`;

/**
 * Contract describing the operations available for album persistence.
 *
 * This repository abstracts Supabase queries and maps database records
 * into domain models using mappers.
 */
export interface AlbumRepositoryContract {
	/**
	 * Fetch all albums without related entities.
	 */
	findAll(): Promise<RepoResult<Album[]>>;

	/**
	 * Fetch a single album by its unique identifier.
	 *
	 * @param id - Album ID
	 */
	findById(id: string): Promise<RepoResult<Album>>;

	/**
	 * Search albums by title prefix.
	 *
	 * Uses a case-insensitive match.
	 *
	 * @param title - Album title prefix
	 */
	searchByTitle(title: string): Promise<RepoResult<Album[]>>;

	/**
	 * Retrieve tracks belonging to an album.
	 *
	 * Does not include additional track relations.
	 *
	 * @param id - Album ID
	 */
	findTracksByAlbumId(id: string): Promise<RepoResult<Track[]>>;

	/**
	 * Retrieve tracks belonging to an album with their relations.
	 *
	 * Includes:
	 * - genres
	 * - track artists
	 * - artist information
	 *
	 * @param id - Album ID
	 */
	findTracksWithRelationsByAlbumId(
		id: string,
	): Promise<RepoResult<TrackAggregate[]>>;

	/**
	 * Fetch all albums with nested track relations.
	 *
	 * This returns a richer aggregate representation suitable
	 * for album detail pages or full library views.
	 */
	findAllWithRelations(): Promise<RepoResult<AlbumAggregate[]>>;

	/**
	 * Fetch a single album with all nested relations.
	 *
	 * Includes:
	 * - album metadata
	 * - album tracks
	 * - track relations (genres, artists)
	 *
	 * @param id - Album ID
	 */
	findWithRelationsById(
		id: string,
	): Promise<RepoResult<AlbumFullAggregate>>;

	/**
	 * Create a new album.
	 *
	 * @param album - Album creation data
	 */
	create(album: CreateAlbum): Promise<RepoResult<Album>>;

	/**
	 * Adds a track to an album.
	 *
	 * @param albumId
	 * @param trackId
	 * @param order - Position of the track within the album
	 */
	addTrack(
		albumId: string,
		trackId: string,
		order: number,
	): Promise<RepoResult>;
}

/**
 * Supabase-backed repository responsible for album persistence.
 *
 * This class:
 * - Executes database queries
 * - Maps raw rows into domain models
 * - Normalizes database errors into RepoResult
 */
export class AlbumRepository implements AlbumRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	/**
	 * Retrieve all albums.
	 */
	async findAll(): Promise<RepoResult<Album[]>> {
		const { data, error } = await this.supabase
			.from("albums")
			.select("*");

		if (error)
			return { success: false, error: mapPostgresError(error) };

		return {
			success: true,
			data: flatMapList(data, AlbumMapper.map),
		};
	}

	/**
	 * Retrieve an album by ID.
	 *
	 * @param id - Album ID
	 */
	async findById(id: string): Promise<RepoResult<Album>> {
		const { data, error } = await this.supabase
			.from("albums")
			.select("*")
			.eq("id", id)
			.single();

		if (error)
			return { success: false, error: mapPostgresError(error) };

		return {
			success: true,
			data: AlbumMapper.map(data),
		};
	}

	/**
	 * Search albums by title prefix using a case-insensitive match.
	 *
	 * @param title - Title prefix
	 */
	async searchByTitle(title: string): Promise<RepoResult<Album[]>> {
		const { data, error } = await this.supabase
			.from("albums")
			.select("*")
			.ilike("title", `${title}%`);

		if (error)
			return { success: false, error: mapPostgresError(error) };

		return {
			success: true,
			data: flatMapList(data, AlbumMapper.map),
		};
	}

	/**
	 * Fetch tracks associated with an album.
	 *
	 * @param id - Album ID
	 */
	async findTracksByAlbumId(id: string): Promise<RepoResult<Track[]>> {
		const { data, error } = await this.supabase
			.from("album_tracks")
			.select("tracks (*)")
			.eq("album_id", id);

		if (error)
			return { success: false, error: mapPostgresError(error) };

		return {
			success: true,
			data: flatMapList(data, (item) =>
				TrackMapper.map(item.tracks),
			),
		};
	}

	/**
	 * Fetch tracks for an album including nested relations.
	 *
	 * Relations included:
	 * - genres
	 * - track artists
	 * - artists
	 *
	 * @param id - Album ID
	 */
	async findTracksWithRelationsByAlbumId(
		id: string,
	): Promise<RepoResult<TrackAggregate[]>> {
		const { data, error } = await this.supabase
			.from("album_tracks")
			.select(TRACK_RELATION_SELECT)
			.eq("album_id", id);

		if (error)
			return { success: false, error: mapPostgresError(error) };

		return {
			success: true,
			data: flatMapList(data, (item) =>
				TrackMapper.mapWithRelations(item.tracks),
			),
		};
	}

	/**
	 * Retrieve all albums with their tracks and track relations.
	 */
	async findAllWithRelations(): Promise<RepoResult<AlbumAggregate[]>> {
		const { data, error } = await this.supabase
			.from("albums")
			.select(ALBUM_RELATION_SELECT);

		if (error)
			return { success: false, error: mapPostgresError(error) };

		return {
			success: true,
			data: flatMapList(data, AlbumMapper.mapWithDetailedRelations),
		};
	}

	/**
	 * Retrieve a single album with all nested relations.
	 *
	 * @param id - Album ID
	 */
	async findWithRelationsById(
		id: string,
	): Promise<RepoResult<AlbumFullAggregate>> {
		const { data, error } = await this.supabase
			.from("albums")
			.select(ALBUM_RELATION_SELECT)
			.eq("id", id)
			.single();

		if (error)
			return { success: false, error: mapPostgresError(error) };

		return {
			success: true,
			data: AlbumMapper.mapWithDetailedRelations(data),
		};
	}

	/**
	 * Create a new album.
	 *
	 * @param album - Album creation data
	 */
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

		if (error)
			return { success: false, error: mapPostgresError(error) };

		return {
			success: true,
			data: AlbumMapper.map(data),
		};
	}

	/**
	 * Adds a track to an album.
	 *
	 * @param albumId
	 * @param trackId
	 * @param order - Position of the track within the album
	 */
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

		if (error)
			return { success: false, error: mapPostgresError(error) };

		return { success: true };
	}
}
