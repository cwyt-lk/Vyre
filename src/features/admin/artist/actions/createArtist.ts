"use server";

import { createArtistSchema } from "@/features/admin/artist/schemas/createSchema";
import { createRepositories } from "@/lib/factories/repository/server";
import { authClient } from "@/lib/safe-action";
import type { CreateArtist } from "@/types/domain";

export const createArtistAction = authClient("admin")
	.inputSchema(createArtistSchema)
	.action(async ({ parsedInput }) => {
		const artistData = parsedInput as CreateArtist;

		const { artists } = await createRepositories();
		const result = await artists.create(artistData);

		if (!result.success) {
			return {
				success: false,
				error: "Failed to add artist. Please try again later.",
			};
		}

		return { success: true };
	});
