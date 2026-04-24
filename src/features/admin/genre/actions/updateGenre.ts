"use server";

import { updateGenreSchema } from "@/features/admin/genre/schemas/updateSchema";
import { createRepositories } from "@/lib/factories/repository/server";
import { authClient } from "@/lib/safe-action";
import type { UpdateGenre } from "@/types/domain";

export const updateGenreAction = authClient("admin")
	.inputSchema(updateGenreSchema)
	.action(async ({ parsedInput }) => {
		const updateData = parsedInput as UpdateGenre;

		const { genres } = await createRepositories();
		const result = await genres.update(updateData);

		if (!result.success) {
			return {
				success: false,
				error: "Failed to update genre. Please try again.",
			};
		}

		return { success: true };
	});
