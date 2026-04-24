"use server";

import { createTrackServerSchema } from "@/features/admin/track/schemas/createSchema";
import { createRepositories } from "@/lib/factories/repository/server";
import { authClient } from "@/lib/safe-action";
import type { CreateTrack } from "@/types/domain";

export const createTrackAction = authClient("admin")
	.inputSchema(createTrackServerSchema)
	.action(async ({ parsedInput }) => {
		const createData = parsedInput as CreateTrack;

		const { tracks } = await createRepositories();
		const createResult =
			await tracks.createTrackWithArtists(createData);

		if (!createResult.success) {
			return {
				success: false,
				error: "Failed to add track. Please try again.",
			};
		}

		return { success: true };
	});
