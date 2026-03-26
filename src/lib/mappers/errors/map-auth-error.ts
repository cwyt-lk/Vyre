import type { AuthError } from "@supabase/supabase-js";
import {
	ConflictError,
	PermissionError,
	UnauthorizedError,
	VyreError,
} from "@/types/errors";

/**
 * Maps an AuthError to a VyreError based on the status code.
 * @param error - The AuthError to map.
 * @returns The corresponding VyreError.
 */
export function mapAuthError(error: AuthError): VyreError {
	const { code, status, message } = error;

	switch (status) {
		case 400: // 400 — Bad request.
			// Supabase-specific code for wrong email/password.
			if (code === "invalid_credentials") {
				return new UnauthorizedError(
					message || "Invalid email or password.",
				);
			}

			return new VyreError(
				message || "Invalid authentication request.",
				code || "AUTH_BAD_REQUEST",
			);

		case 401: // 401 — Authentication required or token invalid.
			return new UnauthorizedError(
				message || "You are not authorized.",
			);

		case 403: // 403 — Authenticated but forbidden.
			return new PermissionError(
				message ||
					"You do not have permission to perform this action.",
			);

		case 422: // 422 — Validation or conflict error.
			return new ConflictError(message || "A conflict occurred.");

		case 429: // 429 — Rate limited.
			return new VyreError(
				message || "Too many requests. Please try again later.",
				"RATE_LIMIT_EXCEEDED",
			);

		// Any unexpected authentication error.
		default:
			console.error("Unknown Auth Error occurred", error);

			return new VyreError(
				message || "An unexpected authentication error occurred.",
				code || "AUTH_UNKNOWN_ERROR",
			);
	}
}
