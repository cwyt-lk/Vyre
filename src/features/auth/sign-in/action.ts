"use server";

import { signInSchema } from "@/features/auth/sign-in/schema";
import { createRepositories } from "@/lib/factories/repository/server";
import { actionClient } from "@/lib/safe-action";

export const signInAction = actionClient
	.inputSchema(signInSchema)
	.action(async ({ parsedInput: { email, password } }) => {
		const { auth } = await createRepositories();
		const result = await auth.signIn(email, password);

		if (!result.success) {
			return { success: false, error: result.error.message };
		}

		return { success: true };
	});
