import { forbidden } from "next/navigation";
import type { ReactNode } from "react";
import { createRepositories } from "@/lib/factories/server";

export default async function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	const { auth } = await createRepositories();
	const { data: userRole } = await auth.getCurrentRole();

	const isAdmin = userRole === "admin";

	if (!isAdmin) forbidden();

	return children;
}
