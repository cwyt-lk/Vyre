"use server";

import { createRepositories } from "@/lib/factories/server";

export async function signOutAction(): Promise<ActionResult> {
	const { auth } = await createRepositories();
	const { error } = await auth.signOut();

	if (error) {
		return { success: false, error: error.message };
	}

	return { success: true };
}
