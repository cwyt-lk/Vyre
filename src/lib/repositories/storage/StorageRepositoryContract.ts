import type { RepoResult } from "@/types/results";

/**
 * Repository contract defining file storage operations.
 *
 * Abstracts Supabase Storage interactions for uploading, moving,
 * and generating URLs for files.
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
	 * @param signedUrlExpiry - Expiry time in seconds (default 3600)
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
	 * @param path - Path to store the file inside the bucket
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
