import "client-only";

import { AlbumRepository } from "@/lib/repositories/album-repository";
import { AuthRepository } from "@/lib/repositories/auth-repository";
import { GenreRepository } from "@/lib/repositories/genre-repository";
import { TrackRepository } from "@/lib/repositories/track-repository";
import { createClient } from "@/lib/supabase/client";

export function createRepositories() {
	const supabase = createClient();

	return {
		auth: new AuthRepository(supabase),
		albums: new AlbumRepository(supabase),
		genres: new GenreRepository(supabase),
		tracks: new TrackRepository(supabase),
	};
}
