import type { Track } from "@/types/domain";

export interface Album {
	id: string;
	title: string;
	description: string | null;
	coverPath: string;
	tracks: Track[];
	createdAt: Date;
}
