"use server";

import { z } from "zod";
import { createRepositories } from "@/lib/factories/repository/server";
import type { UpdateArtist } from "@/types/domain";
import type { ActionResult } from "@/types/results";
import {
	type UpdateArtistInput,
	updateArtistSchema,
} from "../schemas/updateSchema";

export async function updateArtistAction(
	data: UpdateArtistInput,
): Promise<ActionResult> {
	const parsed = updateArtistSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const updateData = parsed.data as UpdateArtist;

	const { artists } = await createRepositories();
	const result = await artists.update(updateData);

	if (!result.success) {
		return {
			success: false,
			error: "Failed to update artist. Please try again.",
		};
	}

	return { success: true };
}
