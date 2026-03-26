import "client-only";

import {
	AlbumRepository,
	ArtistRepository,
	AuthRepository,
	GenreRepository,
	StorageRepository,
	TrackRepository,
} from "@/lib/repositories";
import { createClient } from "@/lib/supabase/client";

/**
 * Creates and returns a collection of repository instances
 * backed by a shared Supabase client.
 *
 * This factory ensures all repositories use the same client instance,
 * which is important for consistent auth state, caching, and request handling
 * in client-side environments.
 *
 * @returns An object containing initialized repository instances.
 *
 * @example
 * ```ts
 * const repos = createRepositories();
 *
 * const albums = await repos.albums.getAll();
 * const user = await repos.auth.getUser();
 * ```
 */
export function createRepositories() {
	const supabase = createClient();

	return {
		auth: new AuthRepository(supabase),
		storage: new StorageRepository(supabase),
		albums: new AlbumRepository(supabase),
		artists: new ArtistRepository(supabase),
		genres: new GenreRepository(supabase),
		tracks: new TrackRepository(supabase),
	};
}
