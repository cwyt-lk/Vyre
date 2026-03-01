import { forbidden, unauthorized } from "next/navigation";
import type { ReactNode } from "react";
import { createRepositories } from "@/lib/factories/repository/server";

export default async function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	const { auth } = await createRepositories();
	const result = await auth.getCurrentRole();

	if (!result.success) unauthorized();

	const userRole = result.data;
	const isAdmin = userRole === "admin";

	if (!isAdmin) forbidden();

	return children;
}
