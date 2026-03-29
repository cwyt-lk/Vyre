"use server";

import { z } from "zod";
import {
	type CreateTrackServerInput,
	createTrackServerSchema,
} from "@/features/admin/track/schemas/createSchema";
import { createRepositories } from "@/lib/factories/repository/server";
import type { CreateTrack } from "@/types/domain";
import type { ActionResult } from "@/types/results";

/**
 * Adds a track and associates artists
 */
export async function createTrackAction(
	data: CreateTrackServerInput,
): Promise<ActionResult> {
	const parsed = createTrackServerSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const createData = parsed.data as CreateTrack;

	const { tracks } = await createRepositories();
	const createResult = await tracks.createTrackWithArtists(createData);

	if (!createResult.success) {
		return {
			success: false,
			error: "Failed to add track. Please try again.",
		};
	}

	return { success: true };
}
