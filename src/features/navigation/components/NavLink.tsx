import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface NavLinkProps {
	href: string;
	label: string;
	isActive: boolean;
	variant?: "default" | "mobile";
}

export const NavLink = ({
	href,
	label,
	isActive,
	variant = "default",
}: NavLinkProps) => {
	if (variant === "mobile") {
		return (
			<Link
				href={href}
				className={cn(
					"block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200",
					isActive
						? "bg-primary text-primary-foreground"
						: "text-foreground hover:bg-muted",
				)}
			>
				{label}
			</Link>
		);
	}

	return (
		<Link
			href={href}
			className={cn(
				"relative py-2 text-sm font-medium transition-colors duration-200",
				isActive
					? "text-primary"
					: "text-muted-foreground hover:text-foreground",
				isActive &&
					"after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary",
			)}
		>
			{label}
		</Link>
	);
};
