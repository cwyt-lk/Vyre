"use server";

import { createRepositories } from "@/lib/factories/repository/server";
import type { ActionResult } from "@/types/results";

export async function deleteAlbumAction(
	id: string,
): Promise<ActionResult> {
	const { albums } = await createRepositories();

	const res = await albums.delete(id);

	if (!res.success) {
		return {
			success: false,
			error: `Failed to Delete Album: ${id}`,
		};
	}

	return {
		success: true,
	};
}
