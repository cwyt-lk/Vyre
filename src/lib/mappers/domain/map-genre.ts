import { parseSupabaseDate } from "@/lib/utils/time";
import type { Genre } from "@/types/domain";
import type { Database } from "@/types/supabase";

export type GenreDB = Database["public"]["Tables"]["genres"]["Row"];

export const GenreMapper = {
	/**
	 * Map a genre row from the database to domain Genre.
	 * @param row - The genre database row.
	 * @returns The mapped Genre object.
	 */
	map(row: GenreDB): Genre {
		return {
			id: row.id,
			key: row.key,
			label: row.label,
			createdAt: parseSupabaseDate(row.created_at),
		};
	},
};
