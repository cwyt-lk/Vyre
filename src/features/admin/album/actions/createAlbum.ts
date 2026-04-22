"use server";

import { z } from "zod";
import {
	type CreateAlbumServerInput,
	createAlbumServerSchema,
} from "@/features/admin/album/schemas/createSchema";
import { createRepositories } from "@/lib/factories/repository/server";
import type { CreateAlbum } from "@/types/domain";
import type { ActionResult } from "@/types/results";

export async function createAlbumAction(
	data: CreateAlbumServerInput,
): Promise<ActionResult> {
	const parsed = createAlbumServerSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const createData = parsed.data as CreateAlbum;

	const { albums } = await createRepositories();
	const createResult = await albums.createAlbumWithTracks(createData);

	if (!createResult.success) {
		return {
			success: false,
			error: "Failed to add album. Please try again.",
		};
	}

	return { success: true };
}
