"use server";

import { z } from "zod";
import {
	type CreateAlbumServerInput,
	createAlbumServerSchema,
} from "@/features/admin/album/schemas/createSchema";
import { createRepositories } from "@/lib/factories/repository/server";
import type { CreateAlbum } from "@/types/domain";
import type { ActionResult } from "@/types/results";

export async function createAlbumAction(
	data: CreateAlbumServerInput,
): Promise<ActionResult> {
	// Validate input
	const parsed = createAlbumServerSchema.safeParse(data);
	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const albumData = parsed.data as CreateAlbum;
	const albumTrackIds = parsed.data.trackIds;

	// Create album
	const { albums } = await createRepositories();
	const createResult = await albums.create(albumData);

	if (!createResult.success) {
		return {
			success: false,
			error: "Failed to add album. Please try again.",
		};
	}

	const albumId = createResult.data.id;

	// Add tracks if any
	if (albumTrackIds?.length) {
		const tracksResult = await albums.addTracks(
			albumId,
			albumTrackIds,
		);

		if (!tracksResult.success) {
			return {
				success: false,
				error: "Failed to add tracks to album. Please try again.",
			};
		}
	}

	return { success: true };
}
