import type { Artist, Genre } from "@/types/domain";

export interface Track {
	id: string;
	title: string;
	genreId: string;
	audioUrl: string;
	createdAt: Date;
}

export type TrackAggregate = Track & {
	artists: Artist[];
	genre: Genre | null;
};

export type CreateTrack = Omit<Track, "id" | "createdAt">;
export type UpdateTrack = Partial<CreateTrack> & Pick<Track, "id">;
