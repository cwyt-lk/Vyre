import type { Genre } from "@/types/domain";
import type { Database } from "@/types/supabase";

export type GenreDB = Database["public"]["Tables"]["genres"]["Row"];

export const GenreMapper = {
	map(row: GenreDB): Genre {
		return {
			id: row.id,
			key: row.key,
			label: row.label,
			createdAt: new Date(row.created_at),
		};
	},
};
