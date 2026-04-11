"use server";

import { createRepositories } from "@/lib/factories/repository/server";
import type { ActionResult } from "@/types/results";

export async function deleteArtistAction(
	id: string,
): Promise<ActionResult> {
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
}
