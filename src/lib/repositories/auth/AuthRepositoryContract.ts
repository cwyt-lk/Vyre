import type { User } from "@/types/domain";
import type { RepoResult } from "@/types/results";

/**
 * Result returned when initiating an OAuth authentication flow.
 */
export interface OAuthResult {
	/** URL to redirect the user to for provider authentication */
	url: string;

	/** OAuth provider used for authentication */
	provider: string;
}

/**
 * Repository contract defining authentication-related operations.
 *
 * Abstracts Supabase Auth interactions and maps responses into domain models.
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
	 * @param provider - OAuth provider (e.g., Google, GitHub)
	 * @param redirectUrl - URL to redirect back to after authentication
	 */
	signInWithOAuth(
		provider: string,
		redirectUrl: string,
	): Promise<RepoResult<OAuthResult>>;

	/** Sign out the currently authenticated user */
	signOut(): Promise<RepoResult>;

	/** Retrieve the currently authenticated user */
	getCurrentUser(): Promise<RepoResult<User>>;

	/** Retrieve the role of the currently authenticated user from JWT claims */
	getCurrentRole(): Promise<RepoResult<string>>;
}
