"use server";

import { z } from "zod";
import {
	type AddGenreInput,
	addGenreSchema,
} from "@/features/admin/add-genre/schema";
import { createRepositories } from "@/lib/factories/repository/server";
import type { CreateGenre } from "@/types/domain";
import type { ActionResult } from "@/types/results";

export async function addGenre(
	data: AddGenreInput,
): Promise<ActionResult> {
	const { genres } = await createRepositories();
	const parsed = addGenreSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const result = await genres.create(parsed.data as CreateGenre);

	if (!result.success) {
		return {
			success: false,
			error:
				result.error.code === "CONFLICT"
					? "Genre key already exists."
					: "Failed to add genre. Please try again.",
		};
	}

	return {
		success: true,
	};
}
