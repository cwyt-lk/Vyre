"use server";

import { z } from "zod";
import {
	type SignInInput,
	signInSchema,
} from "@/features/auth/sign-in/schema";
import { createRepositories } from "@/lib/factories/server";

export async function signInAction(
	input: SignInInput,
): Promise<ActionResult> {
	const parsed = signInSchema.safeParse(input);

	if (!parsed.success) {
		const errorMsg = z
			.flattenError(parsed.error)
			.formErrors.join(", ");

		return { success: false, error: errorMsg || "Invalid input" };
	}

	const { email, password } = parsed.data;

	const { auth } = await createRepositories();
	const { error } = await auth.signIn(email, password);

	if (error) {
		return {
			success: false,
			error: error.message,
		};
	}

	return { success: true };
}
