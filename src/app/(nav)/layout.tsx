import { unauthorized } from "next/navigation";
import type { ReactNode } from "react";
import { NavBar } from "@/features/navigation/components";
import { createRepositories } from "@/lib/factories/repository/server";

export default async function NavLayout({
	children,
}: {
	children: ReactNode;
}) {
	const { auth } = await createRepositories();
	const result = await auth.getCurrentUser();

	if (!result.success) unauthorized();

	return (
		<div className="flex min-h-screen flex-col">
			<NavBar />

			<main className="flex-1">{children}</main>
		</div>
	);
}
