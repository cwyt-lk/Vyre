import type { Track, TrackAggregate } from "@/types/domain";

export interface Album {
	id: string;
	title: string;
	description: string;
	releaseDate: Date;
	coverPath: string | null;
	createdAt: Date;
}

export type AlbumAggregate = Album & {
	tracks: Track[];
};

export type AlbumFullAggregate = Album & {
	tracks: TrackAggregate[];
};

export type CreateAlbum = Omit<Album, "id" | "createdAt">;
export type UpdateAlbum = Partial<CreateAlbum> & Pick<Album, "id">;
