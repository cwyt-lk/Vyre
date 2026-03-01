import Link from "next/link";
import { unauthorized } from "next/navigation";
import type { ReactNode } from "react";
import { VyreLogo } from "@/components/brand/VyreLogo";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/NavigationMenu";
import { SignOutButton } from "@/features/auth/sign-out/components/SignOutButton";
import { createRepositories } from "@/lib/factories/repository/server";

const MENU_ITEMS = [
	{ href: "/home", label: "Home" },
	{ href: "/music/albums", label: "Albums" },
] as const;

const ADMIN_ITEMS = [
	{
		href: "/admin/add-track",
		title: "Add Track",
		description: "Upload new tracks and manage metadata.",
	},
	{
		href: "/admin/add-album",
		title: "Add Album",
		description: "Create a new album collection and assign artists.",
	},
	{
		href: "/admin/add-genre",
		title: "Add Genre",
		description: "Expand the library categories and tags.",
	},
] as const;

const NavLink = ({
	href,
	children,
}: {
	href: string;
	children: ReactNode;
}) => (
	<NavigationMenuItem>
		<NavigationMenuLink
			href={href}
			className={navigationMenuTriggerStyle()}
		>
			{children}
		</NavigationMenuLink>
	</NavigationMenuItem>
);

const AdminMenu = () => (
	<NavigationMenuItem>
		<NavigationMenuTrigger>Admin</NavigationMenuTrigger>
		<NavigationMenuContent>
			{ADMIN_ITEMS.map((item) => (
				<NavigationMenuLink key={item.href} href={item.href}>
					<div className="rounded-md p-2 transition hover:bg-accent/20">
						<div className="text-sm font-medium leading-none">
							{item.title}
						</div>

						<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
							{item.description}
						</p>
					</div>
				</NavigationMenuLink>
			))}
		</NavigationMenuContent>
	</NavigationMenuItem>
);

export default async function NavLayout({
	children,
}: {
	children: ReactNode;
}) {
	const { auth } = await createRepositories();
	const [userResponse, roleResponse] = await Promise.all([
		auth.getCurrentUser(),
		auth.getCurrentRole(),
	]);

	const user = userResponse.data;
	const isAdmin = roleResponse.data === "admin";

	if (!user) unauthorized();

	return (
		<div className="relative flex min-h-screen flex-col">
			<header className="sticky top-0 z-50 w-full bg-muted/25 backdrop-blur-md">
				<nav className="grid grid-cols-3 py-3 px-10">
					<div className="flex items-center justify-start gap-4">
						<Link
							href="/home"
							className="text-center font-bold hover:opacity-40 transition-opacity"
						>
							<VyreLogo className="size-8" />
						</Link>

						<NavigationMenu>
							<NavigationMenuList>
								{MENU_ITEMS.map((item) => (
									<NavLink
										key={item.href}
										href={item.href}
									>
										{item.label}
									</NavLink>
								))}
								{isAdmin && <AdminMenu />}
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					<div />

					<div className="flex items-center justify-end gap-4">
						<span className="hidden text-sm text-muted-foreground md:inline-block">
							{user.email}
						</span>
						<SignOutButton />
					</div>
				</nav>
			</header>

			<main className="flex-1">{children}</main>
		</div>
	);
}
