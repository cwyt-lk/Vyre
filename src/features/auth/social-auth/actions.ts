"use server";

import { redirect } from "next/navigation";
import { createRepositories } from "@/lib/factories/repository/server";
import type { ActionResult } from "@/types/results";

export async function signInWithGithubAction(): Promise<ActionResult> {
	const { auth } = await createRepositories();
	const result = await auth.signInWithOAuth(
		"github",
		`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
	);

	if (!result.success) {
		return { success: false, error: result.error.message };
	}

	redirect(result.data.url);

	return { success: true };
}

export async function signInWithGoogleAction(): Promise<ActionResult> {
	const { auth } = await createRepositories();
	const result = await auth.signInWithOAuth(
		"google",
		`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
	);

	if (!result.success) {
		return { success: false, error: result.error.message };
	}

	redirect(result.data.url);

	return { success: true };
}
