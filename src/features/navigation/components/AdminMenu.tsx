import {
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuTrigger,
} from "@/components/ui/NavigationMenu";
import { AdminListItem } from "@/features/navigation/components/NavItems";
import { ADMIN_SECTIONS } from "../config";

export const AdminMenu = () => (
	<NavigationMenuItem>
		<NavigationMenuTrigger>Admin</NavigationMenuTrigger>
		<NavigationMenuContent>
			<div className="grid w-100 gap-3 p-4 md:w-125 md:grid-cols-2 lg:w-150">
				<ul className="flex flex-col gap-2">
					<li className="mb-1 ml-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
						Create
					</li>
					{ADMIN_SECTIONS.create.map((item) => (
						<AdminListItem key={item.href} {...item} />
					))}
				</ul>
				<ul className="flex flex-col gap-2">
					<li className="mb-1 ml-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
						Manage
					</li>
					{ADMIN_SECTIONS.view.map((item) => (
						<AdminListItem key={item.href} {...item} />
					))}
				</ul>
			</div>
		</NavigationMenuContent>
	</NavigationMenuItem>
);
