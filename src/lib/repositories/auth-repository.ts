import type { Provider, SupabaseClient } from "@supabase/supabase-js";
import { mapUser } from "@/lib/mappers/map-user";
import type { Database } from "@/types/supabase";
import type { User } from "@/types/user";

export interface IAuthRepository {
	signUp(
		email: string,
		password: string,
	): Promise<{ data: User | null; error: Error | null }>;

	signIn(
		email: string,
		password: string,
	): Promise<{ data: User | null; error: Error | null }>;

	signInWithOAuth(
		provider: string,
		redirectUrl: string,
	): Promise<{
		data: { url: string; provider: string } | null;
		error: Error | null;
	}>;

	signOut(): Promise<{ error: Error | null }>;

	getCurrentUser(): Promise<{
		data: User | null;
		error: Error | null;
	}>;
}

export class AuthRepository implements IAuthRepository {
	constructor(private supabase: SupabaseClient<Database>) {}

	async signUp(email: string, password: string) {
		const { data, error } = await this.supabase.auth.signUp({
			email,
			password,
		});

		if (error || !data.user) {
			return {
				data: null,
				error: error ?? new Error("User creation failed"),
			};
		}

		return {
			data: mapUser(data.user),
			error: null,
		};
	}

	async signIn(email: string, password: string) {
		const { data, error } =
			await this.supabase.auth.signInWithPassword({
				email,
				password,
			});

		if (error || !data.user) {
			return {
				data: null,
				error: error ?? new Error("Sign in failed"),
			};
		}

		return {
			data: mapUser(data.user),
			error: null,
		};
	}

	async signInWithOAuth(provider: string, redirectUrl: string) {
		const { data, error } =
			await this.supabase.auth.signInWithOAuth({
				provider: provider as Provider,
				options: {
					redirectTo: redirectUrl,
				},
			});

		if (error || !data.url) {
			return {
				data: null,
				error: error ?? new Error("Sign in failed"),
			};
		}

		return {
			data: {
				url: data.url,
				provider,
			},
			error: null,
		};
	}

	async signOut() {
		const { error } = await this.supabase.auth.signOut();

		if (error) {
			return { error };
		}

		return { error: null };
	}

	async getCurrentUser() {
		const { data, error } = await this.supabase.auth.getUser();

		if (error || !data.user) {
			return {
				data: null,
				error: error ?? null,
			};
		}

		return {
			data: mapUser(data.user),
			error: null,
		};
	}
}
