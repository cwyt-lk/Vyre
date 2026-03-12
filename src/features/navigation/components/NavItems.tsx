import Link from "next/link";
import {
	NavigationMenuLink,
	navigationMenuTriggerStyle,
} from "@/components/ui/NavigationMenu";

interface NavItemProps {
	href: string;
	label: string;
}

export const NavItem = ({ href, label }: NavItemProps) => (
	<NavigationMenuLink
		render={
			<Link href={href} className={navigationMenuTriggerStyle()}>
				{label}
			</Link>
		}
	/>
);

interface AdminListItemProps {
	href: string;
	title: string;
	description: string;
}

export const AdminListItem = ({
	title,
	href,
	description,
}: AdminListItemProps) => (
	<li>
		<NavigationMenuLink
			render={
				<Link
					href={href}
					className={`block select-none space-y-1 rounded-md p-3 leading-none 
						no-underline outline-none transition-colors`}
				>
					<div className="text-sm font-medium leading-none">
						{title}
					</div>

					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{description}
					</p>
				</Link>
			}
		/>
	</li>
);
