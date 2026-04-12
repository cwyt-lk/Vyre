import { cn } from "@/lib/utils/cn";
import { SmartImage } from "../ui/SmartImage";

interface VyreLogoProps {
	className?: string;
	sizes?: string;
}

export const VyreLogo = ({ className, sizes = "40px" }: VyreLogoProps) => {
	return (
		<div className={cn("relative overflow-hidden", className)}>
			<SmartImage
				src="/vyre.webp"
				alt="Vyre logo"
				fill
				sizes={sizes}
				className="object-cover"
			/>
		</div>
	);
};
