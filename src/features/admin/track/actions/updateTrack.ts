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
	const parsed = updateTrackServerSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const updateData = parsed.data as UpdateTrack;

	const { tracks } = await createRepositories();
	const updateResult = await tracks.updateTrackWithArtists(updateData);

	console.log(updateResult);
	console.log(updateData);

	if (!updateResult.success) {
		return {
			success: false,
			error: "Failed to update track. Please try again.",
		};
	}

	return { success: true };
}
