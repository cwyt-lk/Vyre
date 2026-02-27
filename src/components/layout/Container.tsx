import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface ContainerProps extends ComponentPropsWithoutRef<"div"> {}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
	({ children, className, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					"container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
					className,
				)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

Container.displayName = "Container";
