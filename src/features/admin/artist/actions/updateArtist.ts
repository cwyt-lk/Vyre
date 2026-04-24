"use server";

import { updateArtistSchema } from "@/features/admin/artist/schemas/updateSchema";
import { createRepositories } from "@/lib/factories/repository/server";
import { authClient } from "@/lib/safe-action";
import type { UpdateArtist } from "@/types/domain";

export const updateArtistAction = authClient("admin")
	.inputSchema(updateArtistSchema)
	.action(async ({ parsedInput }) => {
		const updateData = parsedInput as UpdateArtist;

		const { artists } = await createRepositories();
		const result = await artists.update(updateData);

		if (!result.success) {
			return {
				success: false,
				error: "Failed to update artist. Please try again.",
			};
		}

		return { success: true };
	});
