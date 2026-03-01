import { redirect } from "next/navigation";
import { createRepositories } from "@/lib/factories/repository/server";

export default async function RootPage() {
	const { auth } = await createRepositories();
	const result = await auth.getCurrentUser();

	if (!result.success) {
		redirect("/auth/sign-in");
	}

	redirect("/home");
}
