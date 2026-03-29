"use server";

import { createRepositories } from "@/lib/factories/repository/server";
import type { ActionResult } from "@/types/results";

export async function deleteGenreAction(
	id: string,
): Promise<ActionResult> {
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
}
