import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { placeholderSvg } from "@/lib/utils/placeholders";

interface VyreLogoProps {
	className?: string;
	sizes?: string;
}

export const VyreLogo = ({ className, sizes = "40px" }: VyreLogoProps) => {
	return (
		<div className={cn("relative overflow-hidden", className)}>
			<Image
				src="/vyre.webp"
				alt="Vyre logo"
				fill
				sizes={sizes}
				priority
				placeholder="blur"
				blurDataURL={placeholderSvg}
				className="object-cover"
			/>
		</div>
	);
};
