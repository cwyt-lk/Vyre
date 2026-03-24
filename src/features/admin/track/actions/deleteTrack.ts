"use server";

import { createRepositories } from "@/lib/factories/repository/server";
import type { ActionResult } from "@/types/results";

export async function deleteTrackAction(
	id: string,
): Promise<ActionResult> {
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
}
