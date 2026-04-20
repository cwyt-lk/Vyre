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

	const [userResult, roleResult] = await Promise.all([
		auth.getCurrentUser(),
		auth.getCurrentRole(),
	]);

	if (!userResult.success || !roleResult.success) unauthorized();

	const isAdmin = roleResult.data === "admin";

	return (
		<div className="flex min-h-screen flex-col">
			<NavBar isAdmin={isAdmin} />

			<main className="flex-1">{children}</main>
		</div>
	);
}
