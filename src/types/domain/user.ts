export interface User {
	id: string;
	email: string;
	fullName?: string | null;
	avatarUrl?: string | null;
	createdAt: Date;
}

export type UserRole = "user" | "admin";
