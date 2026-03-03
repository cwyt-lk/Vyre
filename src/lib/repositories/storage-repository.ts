import type { SupabaseClient } from "@supabase/supabase-js";
import { mapStorageError } from "@/lib/mappers/errors/map-storage-error";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

export interface StorageRepositoryContract {
	getPublicFile(bucket: string, path: string): RepoResult<string>;

	getSignedFile(
		bucket: string,
		path: string,
		signedUrlExpiry?: number,
	): Promise<RepoResult<string>>;

	uploadFile(
		file: File,
		bucket: string,
		path: string,
	): Promise<RepoResult<string>>;

	moveFile(
		bucket: string,
		oldPath: string,
		newPath: string,
	): Promise<RepoResult>;
}

export class StorageRepository implements StorageRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	getPublicFile(bucket: string, path: string): RepoResult<string> {
		const { data } = this.supabase.storage
			.from(bucket)
			.getPublicUrl(path);

		return {
			success: true,
			data: data.publicUrl,
		};
	}

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
