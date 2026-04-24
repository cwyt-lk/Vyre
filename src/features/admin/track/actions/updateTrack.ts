"use server";

import { updateTrackServerSchema } from "@/features/admin/track/schemas/updateSchema";
import { createRepositories } from "@/lib/factories/repository/server";
import { authClient } from "@/lib/safe-action";
import type { UpdateTrack } from "@/types/domain";

export const updateTrackAction = authClient("admin")
	.inputSchema(updateTrackServerSchema)
	.action(async ({ parsedInput }) => {
		const updateData = parsedInput as UpdateTrack;

		const { tracks } = await createRepositories();
		const updateResult =
			await tracks.updateTrackWithArtists(updateData);

		if (!updateResult.success) {
			return {
				success: false,
				error: "Failed to update track. Please try again.",
			};
		}

		return { success: true };
	});
