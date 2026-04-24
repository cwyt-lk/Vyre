"use server";

import { createRepositories } from "@/lib/factories/repository/server";
import { actionClient } from "@/lib/safe-action";

export const signOutAction = actionClient.action(async () => {
	const { auth } = await createRepositories();
	const result = await auth.signOut();

	if (!result.success) {
		return { success: false, error: result.error.message };
	}

	return { success: true };
});
