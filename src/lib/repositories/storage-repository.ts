import type { SupabaseClient } from "@supabase/supabase-js";
import { mapStorageError } from "@/lib/mappers/errors/map-storage-error";
import { VyreError } from "@/types/errors";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

/**
 * Contract describing file storage operations.
 *
 * Implementations handle file uploads, retrieval, and movement
 * using the underlying storage provider (Supabase Storage).
 */
export interface StorageRepositoryContract {
	/**
	 * Get the public URL of a file in a bucket.
	 *
	 * @param bucket - Name of the storage bucket
	 * @param path - Path to the file inside the bucket
	 */
	getPublicFile(bucket: string, path: string): RepoResult<string>;

	/**
	 * Generate a signed URL to access a file temporarily.
	 *
	 * @param bucket - Name of the storage bucket
	 * @param path - Path to the file inside the bucket
	 * @param signedUrlExpiry - Expiry time of the signed URL in seconds (default: 3600)
	 */
	getSignedFile(
		bucket: string,
		path: string,
		signedUrlExpiry?: number,
	): Promise<RepoResult<string>>;

	/**
	 * Upload a file to a specific bucket and path.
	 *
	 * @param file - File object to upload
	 * @param bucket - Name of the storage bucket
	 * @param path - Path to store the file at inside the bucket
	 */
	uploadFile(
		file: File,
		bucket: string,
		path: string,
	): Promise<RepoResult<string>>;

	/**
	 * Move a file from one path to another within the same bucket.
	 *
	 * @param bucket - Name of the storage bucket
	 * @param oldPath - Current path of the file
	 * @param newPath - New path for the file
	 */
	moveFile(
		bucket: string,
		oldPath: string,
		newPath: string,
	): Promise<RepoResult>;
}

/**
 * Supabase-backed repository responsible for file storage operations.
 *
 * This class:
 * - Handles file uploads, moves, and URL generation
 * - Normalizes storage errors into `RepoResult`
 */
export class StorageRepository implements StorageRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	/**
	 * Retrieve the public URL of a file in a bucket.
	 *
	 * @param bucket - Storage bucket name
	 * @param path - File path
	 */
	getPublicFile(bucket: string, path: string): RepoResult<string> {
		const { data } = this.supabase.storage
			.from(bucket)
			.getPublicUrl(path);

		return {
			success: true,
			data: data.publicUrl,
		};
	}

	/**
	 * Generate a signed URL for a file with optional expiry.
	 *
	 * @param bucket - Storage bucket name
	 * @param path - File path
	 * @param signedUrlExpiry - Expiry time in seconds (default 3600)
	 */
	async getSignedFile(
		bucket: string,
		path: string,
		signedUrlExpiry: number = 60 * 60,
	): Promise<RepoResult<string>> {
		const { data, error } = await this.supabase.storage
			.from(bucket)
			.createSignedUrl(path, signedUrlExpiry);

		if (error) {
			return { success: false, error: mapStorageError(error) };
		}

		return {
			success: true,
			data: data.signedUrl,
		};
	}

	/**
	 * Upload a file to a storage bucket at the specified path.
	 *
	 * @param file - File object to upload
	 * @param bucket - Storage bucket name
	 * @param path - File path inside the bucket
	 */
	async uploadFile(
		file: File,
		bucket: string,
		path: string,
	): Promise<RepoResult<string>> {
		const { data, error } = await this.supabase.storage
			.from(bucket)
			.upload(path, file, {
				cacheControl: "3600",
				upsert: true,
			});

		if (error || !data) {
			return {
				success: false,
				error: error
					? mapStorageError(error)
					: new VyreError("Failed to upload file", "BAD_UPLOAD"),
			};
		}

		return {
			success: true,
			data: data.path,
		};
	}

	/**
	 * Move a file from one path to another within the same bucket.
	 *
	 * This operation performs a copy followed by a removal of the old file.
	 *
	 * @param bucket - Storage bucket name
	 * @param oldPath - Current file path
	 * @param newPath - Destination file path
	 */
	async moveFile(
		bucket: string,
		oldPath: string,
		newPath: string,
	): Promise<RepoResult> {
		const { error: copyError } = await this.supabase.storage
			.from(bucket)
			.copy(oldPath, newPath);

		if (copyError) {
			return {
				success: false,
				error: mapStorageError(copyError),
			};
		}

		const { error: removeError } = await this.supabase.storage
			.from(bucket)
			.remove([oldPath]);

		if (removeError) {
			return {
				success: false,
				error: mapStorageError(removeError),
			};
		}

		return {
			success: true,
		};
	}
}
