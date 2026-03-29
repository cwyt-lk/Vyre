import type { Artist, Genre } from "@/types/domain";

export interface Track {
	id: string;
	title: string;
	genreId: string;
	audioPath: string;
	createdAt: Date;
}

export type TrackAggregate = Track & {
	artists: Artist[];
	genre: Genre | null;
};

export type CreateTrack = Omit<Track, "id" | "createdAt"> & {
	artistIds: string[];
};

export type UpdateTrack = Partial<CreateTrack> & Pick<Track, "id">;
