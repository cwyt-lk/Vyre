import { LogIn } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { VyreLogo } from "@/components/brand/VyreLogo";
import { Button } from "@/components/ui/Button";
import { createRepositories } from "@/lib/factories/repository/server";

export default async function RootPage() {
	const { auth } = await createRepositories();
	const result = await auth.getCurrentUser();

	if (result.success) {
		redirect("/home");
	}

	return (
		<main className="min-h-screen">
			<section className="flex min-h-screen items-center justify-center px-4 py-16">
				<div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-2">
					{/* Content */}
					<div className="flex animate-in flex-col gap-8 duration-1000 fade-in">
						{/* Brand */}
						<div className="flex items-center gap-4">
							<VyreLogo sizes="64px" className="size-16" />
							<span className="text-4xl font-semibold uppercase">
								Vyre
							</span>
						</div>

						{/* Headline */}
						<h1 className="max-w-3xl text-5xl font-extrabold tracking-tight lg:text-6xl xl:text-7xl">
							Build Your Sound.
							<br />
							<span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
								Own Your Library.
							</span>
						</h1>

						{/* Description */}
						<p className="max-w-2xl text-lg leading-relaxed text-foreground/70 lg:text-xl">
							Organize your music, curate playlists, and
							explore new artists—all in one place. Designed
							for listeners who want full control over their
							collection.
						</p>

						{/* CTA */}
						<div className="pt-2">
							<Link href="/auth/sign-in">
								<Button
									size="lg"
									className="group w-full sm:w-auto"
								>
									<LogIn className="size-4 transition-transform group-hover:translate-x-0.5" />
									Sign In
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
