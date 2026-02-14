import type { Provider, SupabaseClient } from "@supabase/supabase-js";
import { mapUser } from "@/lib/mappers/map-user";
import type { Database } from "@/types/supabase";
import type { User } from "@/types/user";

export interface IAuthRepository {
    signUp(email: string, password: string): Promise<User>;

    signIn(email: string, password: string): Promise<User>;

    signInWithOAuth(
        provider: string,
        redirectUrl: string,
    ): Promise<{
        url: string;
        provider: string;
    }>;

    signOut(): Promise<void>;

    getCurrentUser(): Promise<User | null>;
}

export class AuthRepository implements IAuthRepository {
    constructor(private supabase: SupabaseClient<Database>) {
    }

    async signUp(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
        });

        if (error || !data.user) {
            throw error ?? new Error("User creation failed");
        }

        return mapUser(data.user);
    }

    async signIn(email: string, password: string) {
        const { data, error } =
            await this.supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (error || !data.user) {
            throw error ?? new Error("Sign in failed");
        }

        return mapUser(data.user);
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
            throw error ?? new Error("Sign in failed");
        }

        return {
            url: data.url,
            provider,
        };
    }

    async signOut() {
        const { error } = await this.supabase.auth.signOut();

        if (error) throw error;
    }

    async getCurrentUser() {
        const { data, error } = await this.supabase.auth.getUser();

        if (error) throw error;

        return mapUser(data.user);
    }
}
