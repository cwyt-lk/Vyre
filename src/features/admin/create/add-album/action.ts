"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
	type AddAlbumServerInput,
	addAlbumServerSchema,
} from "@/features/admin/create/add-album/schema";
import { createRepositories } from "@/lib/factories/repository/server";
import type { CreateAlbum } from "@/types/domain";
import type { ActionResult } from "@/types/results";

export async function addAlbum(
	data: AddAlbumServerInput,
): Promise<ActionResult> {
	// Validate input
	const parsed = addAlbumServerSchema.safeParse(data);
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
		for (const [index, trackId] of albumTrackIds.entries()) {
			const trackResult = await albums.addTrack(
				albumId,
				trackId,
				index,
			);

			if (!trackResult.success) {
				return {
					success: false,
					error: "Failed to add tracks to album. Please try again.",
				};
			}
		}
	}

	// Revalidate the albums page
	revalidatePath("/music/albums");

	return { success: true };
}
