"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/Separator";
import { MENU_ITEMS } from "../config";
import { AdminDropdown } from "./AdminDropdown";
import { NavLink } from "./NavLink";

interface DesktopNavProps {
	isAdmin?: boolean;
}

export const DesktopNav = ({ isAdmin = false }: DesktopNavProps) => {
	const pathname = usePathname();

	return (
		<nav className="flex flex-row items-center justify-center gap-6">
			{MENU_ITEMS.map((item) => {
				const isActive = pathname.startsWith(item.href);

				return (
					<NavLink
						key={item.href}
						href={item.href}
						label={item.label}
						isActive={isActive}
					/>
				);
			})}

			{isAdmin && (
				<>
					<Separator orientation="vertical" />

					<AdminDropdown />
				</>
			)}
		</nav>
	);
};
