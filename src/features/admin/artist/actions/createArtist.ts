"use server";

import { z } from "zod";
import {
	type CreateArtistInput,
	createArtistSchema,
} from "@/features/admin/artist/schemas/createSchema";
import { createRepositories } from "@/lib/factories/repository/server";
import type { CreateArtist } from "@/types/domain";
import type { ActionResult } from "@/types/results";

/**
 * Adds a new artist to the database
 */
export async function createArtistAction(
	data: CreateArtistInput,
): Promise<ActionResult> {
	// Validate input
	const parsed = createArtistSchema.safeParse(data);
	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const artistData = parsed.data as CreateArtist;

	// Create artist
	const { artists } = await createRepositories();
	const result = await artists.create(artistData);

	if (!result.success) {
		return {
			success: false,
			error: "Failed to add artist. Please try again later.",
		};
	}

	return { success: true };
}
