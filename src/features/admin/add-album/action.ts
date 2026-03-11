"use server";

import { z } from "zod";
import {
	type AddAlbumServerInput,
	addAlbumServerSchema,
} from "@/features/admin/add-album/schema";
import { createRepositories } from "@/lib/factories/repository/server";
import type { CreateAlbum } from "@/types/domain";
import type { ActionResult } from "@/types/results";

export async function addAlbum(
	data: AddAlbumServerInput,
): Promise<ActionResult> {
	const { albums } = await createRepositories();
	const parsed = addAlbumServerSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const result = await albums.create(parsed.data as CreateAlbum);

	if (!result.success) {
		return {
			success: false,
			error: "Failed to add track. Please try again.",
		};
	}

	if (parsed.data.trackIds) {
		for (let i = 0; i < parsed.data.trackIds.length; i++) {
			const trackId = parsed.data.trackIds[i];

			const artistResult = await albums.addTrack(
				result.data.id,
				trackId,
				i,
			);

			if (!artistResult.success) {
				return {
					success: false,
					error: "Failed to add artists to track. Please try again.",
				};
			}
		}
	}

	return {
		success: true,
	};
}
