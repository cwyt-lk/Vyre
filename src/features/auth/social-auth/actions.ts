"use server";

import { redirect } from "next/navigation";
import { createRepositories } from "@/lib/factories/repository/server";
import { actionClient } from "@/lib/safe-action";

export const signInWithGithubAction = actionClient.action(async () => {
	const { auth } = await createRepositories();
	const result = await auth.signInWithOAuth(
		"github",
		`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
	);

	if (!result.success) {
		return { success: false, error: result.error.message };
	}

	redirect(result.data.url);
});

export const signInWithGoogleAction = actionClient.action(async () => {
	const { auth } = await createRepositories();
	const result = await auth.signInWithOAuth(
		"google",
		`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
	);

	if (!result.success) {
		return { success: false, error: result.error.message };
	}

	redirect(result.data.url);
});
