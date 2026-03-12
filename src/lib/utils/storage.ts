import type { StorageRepositoryContract } from "@/lib/repositories";

/**
 * Resolves a public file URL from storage.
 * Returns undefined if the file is missing.
 * The UI can provide a placeholder if needed.
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
