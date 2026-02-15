import "server-only";

import { AlbumRepository } from "@/lib/repositories/album-repository";
import { AuthRepository } from "@/lib/repositories/auth-repository";
import { GenreRepository } from "@/lib/repositories/genre-repository";
import { StorageRepository } from "@/lib/repositories/storage-repository";
import { TrackRepository } from "@/lib/repositories/track-repository";
import { createClient } from "@/lib/supabase/server";

export async function createRepositories() {
	const supabase = await createClient();

	return {
		auth: new AuthRepository(supabase),
		storage: new StorageRepository(supabase),
		albums: new AlbumRepository(supabase),
		genres: new GenreRepository(supabase),
		tracks: new TrackRepository(supabase),
	};
}
