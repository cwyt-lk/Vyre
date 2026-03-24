"use server";

import { z } from "zod";
import { createRepositories } from "@/lib/factories/repository/server";
import type { UpdateTrack } from "@/types/domain";
import type { ActionResult } from "@/types/results";
import {
	type UpdateTrackServerInput,
	updateTrackServerSchema,
} from "../schemas/updateSchema";

export async function updateTrackAction(
	data: UpdateTrackServerInput,
): Promise<ActionResult> {
	// Validate input
	const parsed = updateTrackServerSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const updateData = parsed.data as UpdateTrack;
	const { tracks } = await createRepositories();

	// Update Track
	const updateResult = await tracks.update(updateData);

	if (!updateResult.success) {
		return {
			success: false,
			error: "Failed to update track. Please try again.",
		};
	}

	// Associate artists
	// We will be doing a diff check
	// To optimize the deletion and insertion of artists

	const id = updateData.id;
	const trackArtistIds = parsed.data.artistIds;

	if (trackArtistIds) {
		const existingArtistsResult = await tracks.findArtists(id);

		if (!existingArtistsResult.success) {
			return {
				success: false,
				error: "Failed to retrieve existing artists.",
			};
		}

		const existingArtistIds = existingArtistsResult.data.map(
			(it) => it.id,
		);

		const toAdd = trackArtistIds.filter(
			(id) => !existingArtistIds.includes(id),
		);

		const toRemove = existingArtistIds.filter(
			(id) => !trackArtistIds.includes(id),
		);

		const promises = [];

		if (toRemove.length > 0) {
			promises.push(tracks.removeArtists(id, toRemove));
		}

		if (toAdd.length > 0) {
			promises.push(tracks.addArtists(id, toAdd));
		}

		const results = await Promise.all(promises);

		if (results.some((r) => !r.success)) {
			return {
				success: false,
				error: "Failed to diff existing artists.",
			};
		}

		const reorderResult = await tracks.reorderArtists(
			id,
			trackArtistIds,
		);

		console.log(reorderResult);

		if (!reorderResult.success) {
			return {
				success: false,
				error: "Failed to reorder artists.",
			};
		}
	}

	return { success: true };
}
