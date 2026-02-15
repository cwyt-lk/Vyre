import type { Genre } from "@/types/domain/genre";
import type { Database } from "@/types/supabase";

export type GenreDB = Database["public"]["Tables"]["genres"]["Row"];

export function mapGenre(db: GenreDB): Genre {
	return {
		id: db.id,
		key: db.key,
		label: db.label,
		createdAt: new Date(db.created_at),
	};
}
