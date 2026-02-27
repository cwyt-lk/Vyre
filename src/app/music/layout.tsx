import { unauthorized } from "next/navigation";
import type { ReactNode } from "react";
import { createRepositories } from "@/lib/factories/server";

export default async function MusicLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const { auth } = await createRepositories();
	const { data: user } = await auth.getCurrentUser();

	if (!user) {
		unauthorized();
	}

	return children;
}
