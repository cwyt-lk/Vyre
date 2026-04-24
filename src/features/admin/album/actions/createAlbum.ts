"use server";

import { createAlbumServerSchema } from "@/features/admin/album/schemas/createSchema";
import { createRepositories } from "@/lib/factories/repository/server";
import { authClient } from "@/lib/safe-action";
import type { CreateAlbum } from "@/types/domain";

export const createAlbumAction = authClient("admin")
	.inputSchema(createAlbumServerSchema)
	.action(async ({ parsedInput }) => {
		const createData = parsedInput as CreateAlbum;

		const { albums } = await createRepositories();
		const createResult =
			await albums.createAlbumWithTracks(createData);

		if (!createResult.success) {
			return {
				success: false,
				error: "Failed to add album. Please try again.",
			};
		}

		return { success: true };
	});
