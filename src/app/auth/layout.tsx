import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { createRepositories } from "@/lib/factories/repository/server";

export default async function AuthLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const { auth } = await createRepositories();

	const { data: user } = await auth.getCurrentUser();

	if (user) {
		redirect("/home");
	}

	return children;
}
