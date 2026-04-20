"use client";

import { SignOutButton } from "@/features/auth/sign-out/components/SignOutButton";
import { DesktopNav } from "./DesktopNav";
import { NavBrand } from "./NavBrand";

export const NavBar = () => {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="flex h-16 flex-row items-center justify-between px-8">
				<div className="flex flex-row gap-12">
					<NavBrand />
					<DesktopNav />
				</div>

				<div className="flex flex-row gap-6">
					<SignOutButton />
				</div>
			</div>
		</header>
	);
};
