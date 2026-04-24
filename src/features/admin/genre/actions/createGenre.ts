"use server";

import { createGenreSchema } from "@/features/admin/genre/schemas/createSchema";
import { createRepositories } from "@/lib/factories/repository/server";
import { authClient } from "@/lib/safe-action";
import type { CreateGenre } from "@/types/domain";

export const createGenreAction = authClient("admin")
	.inputSchema(createGenreSchema)
	.action(async ({ parsedInput }) => {
		const genreData = parsedInput as CreateGenre;

		const { genres } = await createRepositories();
		const result = await genres.create(genreData);

		if (!result.success) {
			const message =
				result.error.code === "CONFLICT"
					? "Genre key already exists."
					: "Failed to add genre. Please try again.";

			return { success: false, error: message };
		}

		return { success: true };
	});
