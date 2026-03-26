import type { StorageError } from "@supabase/storage-js";
import {
	NotFoundError,
	PermissionError,
	UnauthorizedError,
	VyreError,
} from "@/types/errors";

/**
 * Maps a StorageError to a VyreError based on the status code.
 * @param error - The StorageError to map.
 * @returns The corresponding VyreError.
 */
export function mapStorageError(error: StorageError): VyreError {
	const { status, message } = error;

	switch (status) {
		case 401: // 401 — The request is not authenticated.
			return new UnauthorizedError(
				message || "You are not authorized to access this file.",
			);

		case 403: // 403 — The user is authenticated but lacks permission.
			return new PermissionError(
				message ||
					"You do not have permission to access this file.",
			);

		case 404: // 404 — The file or bucket does not exist.
			return new NotFoundError(
				message || "The requested file could not be found.",
			);

		case 413: // 413 — Payload too large.
			return new VyreError(
				message || "The file size exceeds the allowed limit.",
				"PAYLOAD_TOO_LARGE",
			);

		// Any other unexpected storage error.
		default:
			console.error("Unknown Storage Error occurred:", error);

			return new VyreError(
				message || "An unknown storage error occurred.",
				status?.toString() || "STORAGE_UNKNOWN_ERROR",
			);
	}
}
