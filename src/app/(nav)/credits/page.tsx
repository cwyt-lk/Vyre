import Link from "next/link";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";

const cardSections = [
	{
		title: "Core Framework",
		items: [
			{
				href: "https://nextjs.org",
				label: "Next.js - React framework",
			},
			{
				href: "https://react.dev",
				label: "React - UI library",
			},
			{
				href: "https://www.typescriptlang.org",
				label: "TypeScript - Type safety",
			},
		],
	},
	{
		title: "Database & Auth",
		items: [
			{
				href: "https://supabase.com",
				label: "Supabase - Backend & Auth",
			},
			{
				href: "https://www.postgresql.org",
				label: "PostgreSQL - Database",
			},
		],
	},
	{
		title: "Styling & UI",
		items: [
			{
				href: "https://tailwindcss.com",
				label: "Tailwind CSS - Utility CSS",
			},
			{
				href: "https://ui.shadcn.com",
				label: "shadcn/ui - Component library",
			},
			{
				href: "https://sonner.emilkowal.ski",
				label: "Sonner - Toast notifications",
			},
		],
	},
	{
		title: "Audio & Tools",
		items: [
			{
				href: "https://howlerjs.com/",
				label: "Howler.js - Web Audio Library",
			},
			{
				href: "https://biomejs.dev",
				label: "Biome - Linter & formatter",
			},
			{
				href: "https://pnpm.io",
				label: "pnpm - Package manager",
			},
		],
	},
];

const fontLinks = [
	{
		href: "https://fonts.google.com/specimen/Montserrat",
		label: "Montserrat - Sans serif typeface",
	},
	{
		href: "https://fonts.google.com/specimen/Lora",
		label: "Lora - Serif typeface",
	},
	{
		href: "https://fonts.google.com/specimen/Fira+Code",
		label: "Fira Code - Monospace typeface",
	},
];

const linkClassName =
	"font-medium hover:text-primary text-muted-foreground";
const listClassName = "flex flex-col gap-1 text-sm text-muted-foreground";

export default function CreditsPage() {
	return (
		<section className="flex flex-col gap-10 p-4">
			<div>
				<h1 className="text-4xl font-extrabold lg:text-5xl">
					Credits
				</h1>
			</div>

			{/* Technologies */}
			<div className="flex flex-col gap-4">
				<h2 className="text-2xl font-bold">Built With</h2>
				<div className="grid gap-4 md:grid-cols-2">
					{cardSections.map((section) => (
						<Card key={section.title}>
							<CardHeader>
								<CardTitle>{section.title}</CardTitle>
							</CardHeader>

							<CardContent>
								<ul className={listClassName}>
									{section.items.map((item) => (
										<li key={item.href}>
											<Link
												href={item.href}
												className={linkClassName}
											>
												{item.label}
											</Link>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Fonts */}
			<div className="flex flex-col gap-4">
				<h2 className="text-2xl font-bold">Fonts</h2>
				<Card>
					<CardContent>
						<ul className="flex flex-col gap-2 text-sm">
							{fontLinks.map((font) => (
								<li key={font.href}>
									<Link
										href={font.href}
										className={linkClassName}
									>
										{font.label}
									</Link>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>

			{/* License */}
			<div className="flex flex-col gap-3">
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
