import type { Genre } from "@/types/genre";

export interface Track {
	id: string;
	title: string;
	artists: string[];
	genre: Genre | null;
	description: string | null;
	createdAt: Date;
}
