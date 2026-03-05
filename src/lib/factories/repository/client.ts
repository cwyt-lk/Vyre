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
