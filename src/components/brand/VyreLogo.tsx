import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface VyreLogoProps {
	className?: string;
}

export const VyreLogo = ({ className }: VyreLogoProps) => {
	return (
		<div className={cn("relative overflow-hidden", className)}>
			<Image
				src="/vyre.webp"
				alt="Vyre logo"
				fill
				priority
				className="object-cover"
			/>
		</div>
	);
};
