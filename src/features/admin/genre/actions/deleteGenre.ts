"use server";

import { createRepositories } from "@/lib/factories/repository/server";
import { authClient } from "@/lib/safe-action";
import { idSchema } from "@/lib/schemas";

export const deleteGenreAction = authClient("admin")
	.inputSchema(idSchema)
	.action(async ({ parsedInput: { id } }) => {
		const { genres } = await createRepositories();

		const res = await genres.delete(id);

		if (!res.success) {
			return {
				success: false,
				error: `Failed to Delete Genre: ${id}`,
			};
		}

		return {
			success: true,
		};
	});
