"use server";

import { signUpSchema } from "@/features/auth/sign-up/schema";
import { createRepositories } from "@/lib/factories/repository/server";
import { actionClient } from "@/lib/safe-action";

export const signUpAction = actionClient
	.inputSchema(signUpSchema)
	.action(async ({ parsedInput: { email, password } }) => {
		const { auth } = await createRepositories();
		const result = await auth.signUp(email, password);

		if (!result.success) {
			return {
				success: false,
				error: result.error.message,
			};
		}

		return { success: true };
	});
