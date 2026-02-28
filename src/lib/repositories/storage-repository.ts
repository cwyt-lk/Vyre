import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export interface StorageRepositoryContract {
	getSignedFile(
		bucket: string,
		path: string,
		signedUrlExpiry?: number,
	): Promise<{
		data: string | null;
		error: Error | null;
	}>;

	getPublicFile(
		bucket: string,
		path: string,
	): {
		data: string | null;
		error: Error | null;
	};
}

export class StorageRepository implements StorageRepositoryContract {
	constructor(private supabase: SupabaseClient<Database>) {}

	getPublicFile(bucket: string, path: string) {
		const { data } = this.supabase.storage
			.from(bucket)
			.getPublicUrl(path);

		return {
			data: data.publicUrl,
			error: null,
		};
	}

	async getSignedFile(
		bucket: string,
		path: string,
		signedUrlExpiry: number = 60 * 60,
	) {
		const { data, error } = await this.supabase.storage
			.from(bucket)
			.createSignedUrl(path, signedUrlExpiry);

		if (error || !data) {
			return {
				data: null,
				error: error || new Error("Failed to create signed url"),
			};
		}

		return {
			data: data?.signedUrl,
			error: null,
		};
	}
}
