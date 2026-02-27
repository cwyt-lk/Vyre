import Link from "next/link";
import { unauthorized } from "next/navigation";
import type { ReactNode } from "react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/NavigationMenu";
import { SignOutButton } from "@/features/auth/sign-out/components/SignOutButton";
import { createRepositories } from "@/lib/factories/server";

const MENU_ITEMS = [
	{ href: "/home", label: "Home" },
	{ href: "/music/albums", label: "Albums" },
] as const;

export default async function NavLayout({
	children,
}: {
	children: ReactNode;
}) {
	const { auth } = await createRepositories();
	const { data: user } = await auth.getCurrentUser();

	if (!user) unauthorized();

	return (
		<div className="relative flex min-h-screen flex-col">
			<header className="sticky top-0 z-50 w-full bg-secondary/50 backdrop-blur">
				<nav className="container flex h-16 items-center justify-between py-2 px-4">
					<div className="flex items-center gap-6 md:gap-10">
						<Link
							href="/home"
							className="text-center font-bold hover:opacity-40 transition-opacity"
						>
							Vyre
						</Link>

						<NavigationMenu>
							<NavigationMenuList>
								{MENU_ITEMS.map((item) => (
									<NavigationMenuItem key={item.href}>
										<NavigationMenuLink
											className={navigationMenuTriggerStyle()}
											href={item.href}
										>
											{item.label}
										</NavigationMenuLink>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					<div className="flex items-center gap-4">
						<span className="hidden text-sm text-muted-foreground md:inline-block">
							{user.email}
						</span>

						<SignOutButton />
					</div>
				</nav>
			</header>

			{children}
		</div>
	);
}
