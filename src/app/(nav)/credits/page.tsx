import Link from "next/link";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";

export default function CreditsPage() {
	return (
		<section className="flex flex-col gap-10 p-4">
			<div>
				<h1 className="text-4xl font-extrabold lg:text-5xl">
					Credits
				</h1>
			</div>

			{/* Technologies */}
			<div className="space-y-4">
				<h2 className="text-2xl font-bold">Built With</h2>
				<div className="grid gap-4 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Core Framework</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-1 text-sm text-muted-foreground">
								<li>
									<Link
										href="https://nextjs.org"
										className="hover:text-foreground"
									>
										Next.js - React framework
									</Link>
								</li>
								<li>
									<Link
										href="https://react.dev"
										className="hover:text-foreground"
									>
										React - UI library
									</Link>
								</li>
								<li>
									<Link
										href="https://www.typescriptlang.org"
										className="hover:text-foreground"
									>
										TypeScript - Type safety
									</Link>
								</li>
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Database & Auth</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-1 text-sm text-muted-foreground">
								<li>
									<Link
										href="https://supabase.com"
										className="hover:text-foreground"
									>
										Supabase - Backend & Auth
									</Link>
								</li>
								<li>
									<Link
										href="https://www.postgresql.org"
										className="hover:text-foreground"
									>
										PostgreSQL - Database
									</Link>
								</li>
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Styling & UI</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-1 text-sm text-muted-foreground">
								<li>
									<Link
										href="https://tailwindcss.com"
										className="hover:text-foreground"
									>
										Tailwind CSS - Utility CSS
									</Link>
								</li>
								<li>
									<Link
										href="https://ui.shadcn.com"
										className="hover:text-foreground"
									>
										shadcn/ui - Component library
									</Link>
								</li>
								<li>
									<Link
										href="https://sonner.emilkowal.ski"
										className="hover:text-foreground"
									>
										Sonner - Toast notifications
									</Link>
								</li>
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Audio & Tools</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-1 text-sm text-muted-foreground">
								<li>
									<Link
										href="https://howlerjs.com/"
										className="hover:text-foreground"
									>
										Howler.js - Web Audio Library
									</Link>
								</li>
								<li>
									<Link
										href="https://biomejs.dev"
										className="hover:text-foreground"
									>
										Biome - Linter & formatter
									</Link>
								</li>
								<li>
									<Link
										href="https://pnpm.io"
										className="hover:text-foreground"
									>
										pnpm - Package manager
									</Link>
								</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Fonts */}
			<div className="space-y-4">
				<h2 className="text-2xl font-bold">Fonts</h2>
				<Card>
					<CardContent>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="https://fonts.google.com/specimen/Montserrat"
									className="font-semibold hover:text-primary text-muted-foreground"
								>
									Montserrat - Sans serif typeface
								</Link>
							</li>
							<li>
								<Link
									href="https://fonts.google.com/specimen/Lora"
									className="font-semibold hover:text-primary text-muted-foreground"
								>
									Lora - Serif typeface
								</Link>
							</li>
							<li>
								<Link
									href="https://fonts.google.com/specimen/Fira+Code"
									className="font-semibold hover:text-primary text-muted-foreground"
								>
									Fira Code - Monospace typeface
								</Link>
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>

			{/* License */}
			<div className="space-y-3">
				<h2 className="text-lg font-bold">License</h2>

				<p className="text-sm text-muted-foreground">
					Vyre and its source code are provided as-is for use and
					modification. All third-party libraries and tools are
					used under their respective licenses.
				</p>
			</div>
		</section>
	);
}
