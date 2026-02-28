export type Genre = {
	id: string;
	key: string;
	label: string;
	createdAt: Date;
};

export type CreateGenre = Omit<Genre, "id" | "createdAt">;
