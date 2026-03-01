import { redirect } from "next/navigation";
import { createRepositories } from "@/lib/factories/repository/server";

export default async function RootPage() {
	const { auth } = await createRepositories();

	const { data: user } = await auth.getCurrentUser();

	if (!user) {
		redirect("/auth/sign-in");
	}

	redirect("/home");
}
