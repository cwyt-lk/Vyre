import type { StorageRepositoryContract } from "@/lib/repositories";

/**
 * Resolves a public URL for a file stored in a bucket.
 *
 * This function delegates to the provided storage repository and safely
 * handles missing or invalid paths. If the file cannot be resolved,
 * it returns `undefined` so the UI can decide how to handle fallbacks
 * (e.g., display a placeholder image).
 *
 * @param storage - The storage repository implementation used to fetch the file URL
 * @param bucket - The name of the storage bucket
 * @param path - The file path within the bucket
 * @returns The public file URL if successful, otherwise `undefined`
 */
export function resolvePublicFileUrl(
	storage: StorageRepositoryContract,
	bucket: string,
	path?: string | null,
): string | undefined {
	if (!path) return undefined;

	const result = storage.getPublicFile(bucket, path);

	return result.success ? result.data : undefined;
}
