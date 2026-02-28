"use server";

import { z } from "zod";
import {
	type AddGenreInput,
	addGenreSchema,
} from "@/features/admin/add-genre/schema";
import { createRepositories } from "@/lib/factories/server";
import type { Genre } from "@/types/domain/genre";

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

	const genreData = parsed.data as Genre;
	const { error } = await genres.create(genreData);

	if (error) {
		console.error(error);

		return {
			success: false,
			error: "Failed to add genre. Please try again.",
		};
	}

	return {
		success: true,
	};
}
