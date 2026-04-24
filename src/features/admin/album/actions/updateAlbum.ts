"use server";

import { updateAlbumServerSchema } from "@/features/admin/album/schemas/updateSchema";
import { createRepositories } from "@/lib/factories/repository/server";
import { authClient } from "@/lib/safe-action";
import type { UpdateAlbum } from "@/types/domain";

export const updateAlbumAction = authClient("admin")
	.inputSchema(updateAlbumServerSchema)
	.action(async ({ parsedInput }) => {
		const updateData = parsedInput as UpdateAlbum;

		const { albums } = await createRepositories();
		const updateResult =
			await albums.updateAlbumWithTracks(updateData);

		if (!updateResult.success) {
			return {
				success: false,
				error: "Failed to update album. Please try again.",
			};
		}

		return { success: true };
	});
