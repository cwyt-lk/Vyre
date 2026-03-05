export interface Genre {
	id: string;
	key: string;
	label: string;
	createdAt: Date;
}

export type CreateGenre = Omit<Genre, "id" | "createdAt">;
export type UpdateGenre = Partial<CreateGenre> & Pick<Genre, "id">;
