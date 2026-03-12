"use server";

import { z } from "zod";
import {
	type AddTrackServerInput,
	addTrackServerSchema,
} from "@/features/admin/create/add-track/schema";
import { createRepositories } from "@/lib/factories/repository/server";
import type { CreateTrack } from "@/types/domain";
import type { ActionResult } from "@/types/results";

/**
 * Adds a track and associates artists
 */
export async function addTrackAction(
	data: AddTrackServerInput,
): Promise<ActionResult> {
	// Validate input
	const parsed = addTrackServerSchema.safeParse(data);
	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const trackData = parsed.data as CreateTrack;
	const trackArtistIds = parsed.data.artistIds;

	// Create track
	const { tracks } = await createRepositories();
	const createResult = await tracks.create(trackData);
	if (!createResult.success) {
		return {
			success: false,
			error: "Failed to add track. Please try again.",
		};
	}

	const trackId = createResult.data.id;

	// Associate artists
	for (const [index, artistId] of trackArtistIds.entries()) {
		const artistResult = await tracks.addArtist(
			trackId,
			artistId,
			index,
		);

		if (!artistResult.success) {
			return {
				success: false,
				error: "Failed to add artists to track. Please try again.",
			};
		}
	}

	return { success: true };
}
