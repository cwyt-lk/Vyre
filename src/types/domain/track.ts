import type { Genre } from "@/types/domain";

export interface Track {
	id: string;
	title: string;
	artists: string[];
	genre: Genre | null;
	description: string | null;
	filePath: string;
	createdAt: Date;
}
