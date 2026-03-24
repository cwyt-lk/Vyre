"use server";

import { z } from "zod";
import {
	type UpdateAlbumServerInput,
	updateAlbumServerSchema,
} from "@/features/admin/album/schemas/updateSchema";
import { createRepositories } from "@/lib/factories/repository/server";
import type { UpdateAlbum } from "@/types/domain";
import type { ActionResult } from "@/types/results";

export async function updateAlbumAction(
	data: UpdateAlbumServerInput,
): Promise<ActionResult> {
	// Validate input
	const parsed = updateAlbumServerSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const updateData: UpdateAlbum = parsed.data;

	const { albums } = await createRepositories();

	// Update Album
	const updateResult = await albums.update(updateData);

	if (!updateResult.success) {
		return {
			success: false,
			error: "Failed to update album. Please try again.",
		};
	}

	const id = updateData.id;
	const newTrackIds = parsed.data.trackIds ?? [];
	const existingTracksResult = await albums.findTracksByAlbumId(id);

	if (!existingTracksResult.success) {
		return {
			success: false,
			error: "Failed to fetch existing album tracks.",
		};
	}

	const existingTrackIds = existingTracksResult.data.map(
		(track) => track.id,
	);

	// Handle Removing Tracks
	const removeResult = await albums.removeTracks(id, existingTrackIds);

	if (!removeResult.success) {
		return {
			success: false,
			error: "Failed to remove tracks from album.",
		};
	}

	// Handle Adding New Tracks
	const addResult = await albums.addTracks(id, newTrackIds);

	if (!addResult.success) {
		return {
			success: false,
			error: "Failed to add tracks to album.",
		};
	}

	return { success: true };
}
