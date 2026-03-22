"use server";

import { z } from "zod";
import {
	type CreateGenreInput,
	createGenreSchema,
} from "@/features/admin/genre/schemas/createSchema";
import { createRepositories } from "@/lib/factories/repository/server";
import type { CreateGenre } from "@/types/domain";
import type { ActionResult } from "@/types/results";

/**
 * Adds a new genre to the database
 */
export async function createGenreAction(
	data: CreateGenreInput,
): Promise<ActionResult> {
	// Validate input
	const parsed = createGenreSchema.safeParse(data);
	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const genreData = parsed.data as CreateGenre;

	// Create genre
	const { genres } = await createRepositories();
	const result = await genres.create(genreData);

	if (!result.success) {
		const message =
			result.error.code === "CONFLICT"
				? "Genre key already exists."
				: "Failed to add genre. Please try again.";

		return { success: false, error: message };
	}

	return { success: true };
}
