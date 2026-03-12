import Link from "next/link";
import { unauthorized } from "next/navigation";
import type { ReactNode } from "react";
import { VyreLogo } from "@/components/brand/VyreLogo";
import {
	NavigationMenu,
	NavigationMenuList,
} from "@/components/ui/NavigationMenu";
import { SignOutButton } from "@/features/auth/sign-out/components/SignOutButton";
import { AdminMenu } from "@/features/navigation/components/AdminMenu";
import { NavItem } from "@/features/navigation/components/NavItems";
import { MENU_ITEMS } from "@/features/navigation/config";
import { createRepositories } from "@/lib/factories/repository/server";

export default async function NavLayout({
	children,
}: {
	children: ReactNode;
}) {
	const { auth } = await createRepositories();
	const [userResult, roleResult] = await Promise.all([
		auth.getCurrentUser(),
		auth.getCurrentRole(),
	]);

	if (!userResult.success || !roleResult.success) unauthorized();

	const user = userResult.data;
	const isAdmin = roleResult.data === "admin";

	return (
		<div className="flex min-h-screen flex-col">
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="flex h-16 items-center justify-between px-8">
					<div className="flex items-center gap-8">
						<Link
							href="/home"
							className="transition-opacity hover:opacity-70"
						>
							<VyreLogo className="size-8" />
						</Link>

						<NavigationMenu>
							<NavigationMenuList>
								{MENU_ITEMS.map((item) => (
									<NavItem key={item.href} {...item} />
								))}
								{isAdmin && <AdminMenu />}
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					<div className="flex items-center gap-4">
						<span className="hidden text-sm text-muted-foreground lg:block">
							{user.email}
						</span>

						<SignOutButton />
					</div>
				</div>
			</header>

			<main className="flex-1">{children}</main>
		</div>
	);
}
