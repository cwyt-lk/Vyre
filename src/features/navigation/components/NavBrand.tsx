import Link from "next/link";
import { VyreLogo } from "@/components/brand/VyreLogo";

export const NavBrand = () => {
	return (
		<Link
			href="/home"
			className="flex items-center gap-2.5 text-lg font-semibold transition-opacity duration-200 hover:opacity-75"
		>
			<VyreLogo className="size-8" />

			<span className="sm:inline">Vyre</span>
		</Link>
	);
};
