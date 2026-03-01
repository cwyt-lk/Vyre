import type { SupabaseClient } from "@supabase/supabase-js";
import { mapStorageError } from "@/lib/mappers/errors/map-storage-error";
import type { RepoResult } from "@/types/results";
import type { Database } from "@/types/supabase";

export interface StorageRepositoryContract {
	getSignedFile(
		bucket: string,
		path: string,
		signedUrlExpiry?: number,
	): Promise<RepoResult<string>>;

	getPublicFile(bucket: string, path: string): RepoResult<string>;
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
}
