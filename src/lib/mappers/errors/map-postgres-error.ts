import type { PostgrestError } from "@supabase/supabase-js";
import {
	ConflictError,
	PermissionError,
	ReferenceViolationError,
	UnauthorizedError,
	VyreError,
} from "@/types/errors";

/**
 * Maps a PostgrestError to a VyreError based on the error code.
 * @param error - The PostgrestError to map.
 * @returns The corresponding VyreError.
 */
export function mapPostgresError(error: PostgrestError): VyreError {
	const { code, message } = error;

	switch (code) {
		case "23505": // Unique violation (conflict)
			return new ConflictError(
				message || "This record already exists.",
			);

		case "42501": // Insufficient privilege (permission error)
			return new PermissionError();

		case "28000": // Invalid authorization (authentication error)
			return new UnauthorizedError();

		case "23503": // Foreign key violation (reference violation)
			return new ReferenceViolationError(
				message ||
					"This record is linked to other data and cannot be changed.",
			);

		default:
			console.log("Unknown Database Error occurred", error);

			return new VyreError(
				message || "An unknown error occurred.",
				code || "UNKNOWN_ERROR",
			);
	}
}
