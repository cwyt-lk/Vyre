"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
	type AddArtistInput,
	addArtistSchema,
} from "@/features/admin/create/add-artist/schema";
import { createRepositories } from "@/lib/factories/repository/server";
import type { CreateArtist } from "@/types/domain";
import type { ActionResult } from "@/types/results";

export async function addArtist(
	data: AddArtistInput,
): Promise<ActionResult> {
	const { artists } = await createRepositories();
	const parsed = addArtistSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const result = await artists.create(parsed.data as CreateArtist);

	if (!result.success) {
		return {
			success: false,
			error: "Failed to add artist. Please try again later.",
		};
	}

	// Revalidate the add track page
	revalidatePath("/admin/add-track");

	return {
		success: true,
	};
}
