"use server";

import { createRepositories } from "@/lib/factories/repository/server";
import { authClient } from "@/lib/safe-action";
import { idSchema } from "@/lib/schemas";

export const deleteArtistAction = authClient("admin")
	.inputSchema(idSchema)
	.action(async ({ parsedInput: { id } }) => {
		const { artists } = await createRepositories();

		const res = await artists.delete(id);

		if (!res.success) {
			return {
				success: false,
				error: `Failed to Delete Artist: ${id}`,
			};
		}

		return {
			success: true,
		};
	});
