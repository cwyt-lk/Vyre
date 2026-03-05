import type { Artist } from "@/types/domain";
import type { Database } from "@/types/supabase";

export type ArtistDB = Database["public"]["Tables"]["artists"]["Row"];

export const ArtistMapper = {
	map(row: ArtistDB): Artist {
		return {
			id: row.id,
			name: row.name,
			bio: row.bio,
			createdAt: new Date(row.created_at),
		};
	},
};
