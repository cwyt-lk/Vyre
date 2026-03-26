import "server-only";

import {
	AlbumRepository,
	ArtistRepository,
	AuthRepository,
	GenreRepository,
	StorageRepository,
	TrackRepository,
} from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";

/**
 * Creates and returns a collection of repository instances
 * backed by a shared Supabase client.
 *
 * This factory ensures all repositories use the same server instance,
 * which is important for consistent auth state, caching, and request handling
 * in server-side environments.
 *
 * @returns An object containing initialized repository instances.
 *
 * @example
 * ```ts
 * const repos = await createRepositories();
 *
 * const albums = await repos.albums.getAll();
 * const user = await repos.auth.getUser();
 * ```
 */
export async function createRepositories() {
	const supabase = await createClient();

	return {
		auth: new AuthRepository(supabase),
		storage: new StorageRepository(supabase),
		albums: new AlbumRepository(supabase),
		artists: new ArtistRepository(supabase),
		genres: new GenreRepository(supabase),
		tracks: new TrackRepository(supabase),
	};
}
