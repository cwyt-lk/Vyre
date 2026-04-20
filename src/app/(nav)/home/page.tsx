import { Clock, Radio, Sparkles } from "lucide-react";
import Link from "next/link";
import { unauthorized } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createRepositories } from "@/lib/factories/repository/server";
import { capitalize, getNameFromEmail } from "@/lib/utils/string";

export default async function HomePage() {
	const { auth } = await createRepositories();
	const result = await auth.getCurrentUser();

	if (!result.success) unauthorized();

	const user = result.data;
	const greetingName = user.fullName ?? getNameFromEmail(user.email);

	// Determine greeting based on time of day
	const hour = new Date().getHours();
	let greeting = "Good morning";

	if (hour >= 12 && hour < 18) {
		greeting = "Good afternoon";
	}

	if (hour >= 18) {
		greeting = "Good evening";
	}

	return (
		<main className="min-h-screen bg-background">
			<div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-8 sm:px-8 sm:py-12">
				<div className="flex flex-col gap-6 duration-700 ease-out fade-in">
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-3.5">
							<Clock className="size-16" />

							<div>
								<p className="text-lg text-muted-foreground capitalize">
									{greeting}
								</p>
								<h1 className="text-4xl font-bold sm:text-5xl">
									{capitalize(greetingName)}
								</h1>
							</div>
						</div>

						<p className="text-lg text-muted-foreground">
							Welcome back to your music hub. Ready to
							discover something new?
						</p>
					</div>

					{/* Quick Action Buttons */}
					<div className="flex w-1/2 flex-col gap-3 sm:flex-row">
						<Link href="/music/albums" className="flex-1">
							<Button
								size="lg"
								variant="outline"
								className="w-full gap-2"
							>
								<Radio className="size-4" />
								Browse Albums
							</Button>
						</Link>

						<Link href="/credits" className="flex-1">
							<Button
								size="lg"
								variant="outline"
								className="w-full gap-2"
							>
								<Sparkles className="size-4" />
								Credits
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
