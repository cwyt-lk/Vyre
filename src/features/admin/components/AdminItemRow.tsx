"use client";

import { Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/Item";
import { SmartImage } from "@/components/ui/SmartImage";
import { AdminDeleteButton } from "@/features/admin/components/AdminDeleteButton";

interface AdminItemRowProps {
	id: string;
	title: string;
	editHref: string;
	description?: string;
	imageUrl?: string;
	isDeleting?: boolean;
	onDelete?: (id: string) => void;
}

export const AdminItemRow = ({
	id,
	title,
	description,
	editHref,
	imageUrl,
	isDeleting,
	onDelete,
}: AdminItemRowProps) => {
	return (
		<Item
			variant="card"
			size="sm"
			className="group transition duration-300 hover:bg-muted"
		>
			{imageUrl && (
				<ItemMedia
					variant="image"
					className="group-data-[size=sm]/item:size-14"
				>
					<SmartImage
						src={imageUrl}
						alt={title}
						sizes="(max-width: 640px) 56px, 80px"
						fill
						className="transition-transform group-hover:scale-105"
					/>
				</ItemMedia>
			)}

			<ItemContent>
				<ItemTitle className="w-3/4 text-base font-semibold truncate">
					{title}
				</ItemTitle>

				{description && (
					<ItemDescription>{description}</ItemDescription>
				)}
			</ItemContent>

			<ItemActions>
				<Link href={editHref}>
					<Button
						variant="ghost"
						size="icon"
						className="size-8 text-muted-foreground hover:text-primary"
					>
						<Edit className="size-5" />
					</Button>
				</Link>

				<AdminDeleteButton
					id={id}
					title={title}
					isDeleting={isDeleting}
					onDelete={onDelete}
				/>
			</ItemActions>
		</Item>
	);
};
