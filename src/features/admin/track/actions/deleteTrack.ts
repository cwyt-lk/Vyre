"use server";

import { createRepositories } from "@/lib/factories/repository/server";
import { authClient } from "@/lib/safe-action";
import { idSchema } from "@/lib/schemas";

export const deleteTrackAction = authClient("admin")
	.inputSchema(idSchema)
	.action(async ({ parsedInput: { id } }) => {
		const { tracks } = await createRepositories();

		const res = await tracks.delete(id);

		if (!res.success) {
			return {
				success: false,
				error: `Failed to Delete Track: ${id}`,
			};
		}

		return {
			success: true,
		};
	});
