"use client";

import { AlertCircle } from "lucide-react";
import Image, { type ImageProps } from "next/image";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { placeholderSvg } from "@/lib/utils/placeholders";
import { Skeleton } from "./Skeleton";

export interface SmartImageProps extends ImageProps {
	fallbackSrc?: string;
}

export const SmartImage = ({
	src,
	alt,
	fallbackSrc = placeholderSvg,
	className,
	...props
}: SmartImageProps) => {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	const handleImageLoad = useCallback(() => {
		setIsLoading(false);
	}, []);

	const handleImageError = useCallback(() => {
		setIsLoading(false);
		setHasError(true);
	}, []);

	return (
		<>
			{isLoading && <Skeleton className="absolute inset-0" />}
			<Image
				{...props}
				src={src}
				alt={alt}
				className={cn(
					className,
					isLoading && "opacity-0",
					hasError && "hidden",
				)}
				onLoad={handleImageLoad}
				onError={handleImageError}
			/>
			{hasError && (
				<div className="text-destructive">
					<AlertCircle className="size-5" />
				</div>
			)}
		</>
	);
};
