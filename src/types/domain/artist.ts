export interface Artist {
	id: string;
	name: string;
	bio?: string;
	createdAt: Date;
}

export type CreateArtist = Omit<Artist, "id" | "createdAt">;
export type UpdateArtist = Partial<CreateArtist> & Pick<Artist, "id">;
