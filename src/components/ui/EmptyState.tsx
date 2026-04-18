"use client";

import type { ReactNode } from "react";

/**
 * Props for the EmptyState component.
 * @property icon - React component to display (typically a lucide icon).
 * @property title - Main heading text for the empty state.
 * @property description - Supporting text explaining the empty state.
 * @property action - Optional action button configuration.
 * @property action.label - Text label for the action button.
 * @property action.onClick - Callback function when button is clicked.
 * @property action.variant - Button style variant (optional).
 */
export interface EmptyStateProps {
	icon: ReactNode;
	title: string;
	description: string;
}

/**
 * Generic empty state component for displaying when no data is available.
 *
 * Displays a centered card with an icon, title, description, and optional action button.
 * Can be used for various empty states (albums, artists, search results, etc.).
 *
 * @param props - Configuration for the empty state.
 * @returns A centered empty state UI component.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<Album className="size-16" />}
 *   title="Collection empty"
 *   description="There are no albums available to stream at the moment."
 * />
 * ```
 */
export const EmptyState = ({
	icon,
	title,
	description,
}: EmptyStateProps) => {
	return (
		<div className="relative flex min-h-[70vh] items-center justify-center px-6">
			<div className="flex max-w-sm flex-col items-center gap-2 text-center">
				<div className="mb-6">
					<div className="rounded-2xl bg-primary/10 p-6 shadow-sm ring-primary/20">
						{icon}
					</div>
				</div>

				<h2 className="text-2xl font-bold tracking-tight">
					{title}
				</h2>

				<p className="text-muted-foreground">{description}</p>
			</div>
		</div>
	);
};
