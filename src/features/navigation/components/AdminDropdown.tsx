"use client";

import { Plus, View } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/NavigationMenu";
import { ADMIN_SECTIONS } from "../config";
import type { AdminSectionItem } from "../types";

interface AdminSectionProps {
	title: string;
	icon: ReactNode;
	items: AdminSectionItem[];
}

export const AdminDropdown = () => {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger className="relative py-2 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors duration-200">
						Admin
					</NavigationMenuTrigger>

					<NavigationMenuContent>
						<div className="grid gap-6 p-6 md:w-150 md:grid-cols-2 lg:w-175">
							<AdminSection
								title="Create"
								items={ADMIN_SECTIONS.create}
								icon={<Plus className="size-4" />}
							/>

							<AdminSection
								title="View"
								items={ADMIN_SECTIONS.view}
								icon={<View className="size-4" />}
							/>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
};

const AdminSection = ({ title, icon, items }: AdminSectionProps) => {
	return (
		<div>
			<div className="mb-3 flex items-center gap-2">
				{icon}

				<p className="text-sm font-semibold text-foreground">
					{title}
				</p>
			</div>

			<ul className="flex flex-col gap-2">
				{items.map((item) => (
					<li key={item.href}>
						<Link
							href={item.href}
							className="group block rounded-lg p-3 transition-all duration-200 hover:bg-muted/50"
						>
							<p className="text-sm font-medium text-foreground group-hover:text-primary">
								{item.title}
							</p>
							<p className="text-xs text-muted-foreground">
								{item.description}
							</p>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};
