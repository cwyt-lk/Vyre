"use server";

import { z } from "zod";
import {
	type UpdateAlbumServerInput,
	updateAlbumServerSchema,
} from "@/features/admin/album/schemas/updateSchema";
import { createRepositories } from "@/lib/factories/repository/server";
import type { UpdateAlbum } from "@/types/domain";
import type { ActionResult } from "@/types/results";

export async function updateAlbumAction(
	data: UpdateAlbumServerInput,
): Promise<ActionResult> {
	const parsed = updateAlbumServerSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const updateData = parsed.data as UpdateAlbum;

	const { albums } = await createRepositories();
	const result = await albums.updateAlbumWithTracks(updateData);

	if (!result.success) {
		return {
			success: false,
			error: "Failed to update album. Please try again.",
		};
	}

	return { success: true };
}
