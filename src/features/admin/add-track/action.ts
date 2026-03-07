"use server";

import { z } from "zod";
import {
	type AddTrackServerInput,
	addTrackServerSchema,
} from "@/features/admin/add-track/schema";
import { createRepositories } from "@/lib/factories/repository/server";
import type { CreateTrack } from "@/types/domain";
import type { ActionResult } from "@/types/results";

export async function addTrack(
	data: AddTrackServerInput,
): Promise<ActionResult> {
	const { tracks } = await createRepositories();
	const parsed = addTrackServerSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const result = await tracks.create(parsed.data as CreateTrack);

	if (!result.success) {
		return {
			success: false,
			error: "Failed to add track. Please try again.",
		};
	}

	for (let i = 0; i < parsed.data.artistIds.length; i++) {
		const artistId = parsed.data.artistIds[i];

		const artistResult = await tracks.addArtist(
			result.data.id,
			artistId,
			i,
		);

		if (!artistResult.success) {
			return {
				success: false,
				error: "Failed to add artists to track. Please try again.",
			};
		}
	}

	return {
		success: true,
	};
}
