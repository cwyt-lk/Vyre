import { unauthorized } from "next/navigation";
import { createRepositories } from "@/lib/factories/repository/server";
import { capitalize, getNameFromEmail } from "@/lib/utils/string";

export default async function HomePage() {
	const { auth } = await createRepositories();
	const { data: user } = await auth.getCurrentUser();

	if (!user) unauthorized();

	const greetingName = user.fullName ?? getNameFromEmail(user.email);

	return (
		<section className="flex flex-col gap-10 p-4">
			<h1 className="text-4xl font-extrabold lg:text-5xl">
				Welcome back,{" "}
				<span className="text-primary">
					{capitalize(greetingName)}
				</span>
			</h1>
		</section>
	);
}
