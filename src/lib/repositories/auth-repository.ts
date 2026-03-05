import type { Provider, SupabaseClient } from "@supabase/supabase-js";
import { mapUser } from "@/lib/mappers/domain";
import { mapAuthError } from "@/lib/mappers/errors";
import type { User } from "@/types/domain";
import { VyreError } from "@/types/errors";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

/**
 * Result returned when initiating an OAuth authentication flow.
 */
interface OAuthResult {
	/** URL to redirect the user to for provider authentication */
	url: string;

	/** OAuth provider used for authentication */
	provider: string;
}

/**
 * Contract describing authentication-related persistence operations.
 *
 * Implementations are responsible for interacting with the authentication
 * provider (Supabase Auth) and mapping responses into domain models.
 */
export interface AuthRepositoryContract {
	/**
	 * Register a new user using email and password authentication.
	 *
	 * @param email - User email address
	 * @param password - User password
	 */
	signUp(email: string, password: string): Promise<RepoResult<User>>;

	/**
	 * Authenticate an existing user using email and password.
	 *
	 * @param email - User email address
	 * @param password - User password
	 */
	signIn(email: string, password: string): Promise<RepoResult<User>>;

	/**
	 * Initiate an OAuth authentication flow.
	 *
	 * Returns a URL that the client should redirect the user to
	 * in order to authenticate with the selected provider.
	 *
	 * @param provider - OAuth provider (e.g. google, github)
	 * @param redirectUrl - URL to redirect back to after authentication
	 */
	signInWithOAuth(
		provider: string,
		redirectUrl: string,
	): Promise<RepoResult<OAuthResult>>;

	/**
	 * Sign out the currently authenticated user.
	 */
	signOut(): Promise<RepoResult<void>>;

	/**
	 * Retrieve the currently authenticated user.
	 */
	getCurrentUser(): Promise<RepoResult<User>>;

	/**
	 * Retrieve the role of the currently authenticated user
	 * from the JWT claims.
	 */
	getCurrentRole(): Promise<RepoResult<string>>;
}

/**
 * Supabase-backed repository responsible for authentication operations.
 *
 * This class:
 * - Communicates with Supabase Auth
 * - Maps auth responses into domain user models
 * - Normalizes authentication errors into `RepoResult`
 */
export class AuthRepository implements AuthRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	/**
	 * Register a new user using email and password.
	 *
	 * @param email - User email address
	 * @param password - User password
	 */
	async signUp(
		email: string,
		password: string,
	): Promise<RepoResult<User>> {
		const { data, error } = await this.supabase.auth.signUp({
			email,
			password,
		});

		if (error || !data.user) {
			return {
				success: false,
				error: error
					? mapAuthError(error)
					: new VyreError("Sign up failed", "BAD_SIGN_UP"),
			};
		}

		return { success: true, data: mapUser(data.user) };
	}

	/**
	 * Authenticate a user with email and password.
	 *
	 * @param email - User email address
	 * @param password - User password
	 */
	async signIn(
		email: string,
		password: string,
	): Promise<RepoResult<User>> {
		const { data, error } =
			await this.supabase.auth.signInWithPassword({
				email,
				password,
			});

		if (error || !data.user) {
			return {
				success: false,
				error: error
					? mapAuthError(error)
					: new VyreError("Sign in failed", "BAD_SIGN_IN"),
			};
		}

		return { success: true, data: mapUser(data.user) };
	}

	/**
	 * Start an OAuth authentication flow.
	 *
	 * Returns a provider redirect URL that the client
	 * should navigate to for authentication.
	 *
	 * @param provider - OAuth provider name
	 * @param redirectUrl - Redirect URL after successful authentication
	 */
	async signInWithOAuth(
		provider: string,
		redirectUrl: string,
	): Promise<RepoResult<OAuthResult>> {
		const { data, error } = await this.supabase.auth.signInWithOAuth({
			provider: provider as Provider,
			options: { redirectTo: redirectUrl },
		});

		if (error || !data.url) {
			return {
				success: false,
				error: error
					? mapAuthError(error)
					: new VyreError("OAuth failed", "BAD_OAUTH"),
			};
		}

		return { success: true, data: { url: data.url, provider } };
	}

	/**
	 * Sign out the current user.
	 */
	async signOut(): Promise<RepoResult> {
		const { error } = await this.supabase.auth.signOut();

		return error
			? { success: false, error: mapAuthError(error) }
			: { success: true };
	}

	/**
	 * Retrieve the currently authenticated user from Supabase.
	 */
	async getCurrentUser(): Promise<RepoResult<User>> {
		const { data, error } = await this.supabase.auth.getUser();

		if (error) {
			return {
				success: false,
				error: mapAuthError(error),
			};
		}

		return { success: true, data: mapUser(data.user) };
	}

	/**
	 * Retrieve the role of the currently authenticated user
	 * from JWT claims.
	 *
	 * Falls back to `"user"` if no role claim exists.
	 */
	async getCurrentRole(): Promise<RepoResult<string>> {
		const { data, error } = await this.supabase.auth.getClaims();

		if (error || !data) {
			return {
				success: false,
				error: error
					? mapAuthError(error)
					: new VyreError("No JWT token", "BAD_JWT_TOKEN"),
			};
		}

		return { success: true, data: data.claims?.user_role ?? "user" };
	}
}
