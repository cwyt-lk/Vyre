import { parseSupabaseDate } from "@/lib/utils/time";
import type { Artist } from "@/types/domain";
import type { Database } from "@/types/supabase";

export type ArtistDB = Database["public"]["Tables"]["artists"]["Row"];

export const ArtistMapper = {
	/**
	 * Map an artist row from the database to domain Artist.
	 * @param row - The artist database row.
	 * @returns The mapped Artist object.
	 */
	map(row: ArtistDB): Artist {
		return {
			id: row.id,
			name: row.name,
			bio: row.bio,
			createdAt: parseSupabaseDate(row.created_at),
		};
	},
};
