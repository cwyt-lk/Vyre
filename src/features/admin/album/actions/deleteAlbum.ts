"use server";

import { createRepositories } from "@/lib/factories/repository/server";
import { authClient } from "@/lib/safe-action";
import { idSchema } from "@/lib/schemas";

export const deleteAlbumAction = authClient("admin")
	.inputSchema(idSchema)
	.action(async ({ parsedInput: { id } }) => {
		const { albums } = await createRepositories();

		const res = await albums.delete(id);

		if (!res.success) {
			return {
				success: false,
				error: `Failed to Delete Album: ${id}`,
			};
		}

		return {
			success: true,
		};
	});
