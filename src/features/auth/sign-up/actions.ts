"use server";

import { z } from "zod";
import {
	type SignUpInput,
	signUpSchema,
} from "@/features/auth/sign-up/schema";
import { createRepositories } from "@/lib/factories/repository/server";
import type { ActionResult } from "@/types/results";

export async function signUpAction(
	input: SignUpInput,
): Promise<ActionResult> {
	const parsed = signUpSchema.safeParse(input);

	if (!parsed.success) {
		const errorMsg = z
			.flattenError(parsed.error)
			.formErrors.join(", ");

		return { success: false, error: errorMsg || "Invalid input" };
	}

	const { email, password } = parsed.data;

	const { auth } = await createRepositories();
	const result = await auth.signUp(email, password);

	if (!result.success) {
		return {
			success: false,
			error: result.error.message,
		};
	}

	return { success: true };
}
