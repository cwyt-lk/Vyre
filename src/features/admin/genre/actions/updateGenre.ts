"use server";

import { z } from "zod";
import { createRepositories } from "@/lib/factories/repository/server";
import type { UpdateGenre } from "@/types/domain";
import type { ActionResult } from "@/types/results";
import {
	type UpdateGenreInput,
	updateGenreSchema,
} from "../schemas/updateSchema";

export async function updateGenreAction(
	data: UpdateGenreInput,
): Promise<ActionResult> {
	const parsed = updateGenreSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const updateData = parsed.data as UpdateGenre;

	const { genres } = await createRepositories();
	const result = await genres.update(updateData);

	if (!result.success) {
		return {
			success: false,
			error: "Failed to update genre. Please try again.",
		};
	}

	return { success: true };
}
