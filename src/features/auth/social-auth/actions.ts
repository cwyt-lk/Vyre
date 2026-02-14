"use server";

import { redirect } from "next/navigation";
import { createRepositories } from "@/lib/factories/server";

export async function signInWithGithub() {
	const { auth } = await createRepositories();

	const { data, error } = await auth.signInWithOAuth(
		"github",
		`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
	);

	if (error) throw error;

	if (data.url) {
		redirect(data.url);
	}
}

export async function signInWithGoogle() {
	const { auth } = await createRepositories();

	const { data, error } = await auth.signInWithOAuth(
		"google",
		`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
	);

	if (error) throw error;

	if (data.url) {
		redirect(data.url);
	}
}
