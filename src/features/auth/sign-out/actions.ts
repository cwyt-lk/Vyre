"use server";

import { createRepositories } from "@/lib/factories/repository/server";
import type { ActionResult } from "@/types/results";

export async function signOutAction(): Promise<ActionResult> {
	const { auth } = await createRepositories();
	const result = await auth.signOut();

	if (!result.success) {
		return { success: false, error: result.error.message };
	}

	return { success: true };
}
