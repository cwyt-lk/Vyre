"use client";

import { Edit } from "lucide-react";
import Image from "next/image";
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
import { AdminDeleteButton } from "@/features/admin/components/AdminDeleteButton";
import { placeholderSvg } from "@/lib/utils/placeholders";

interface AlbumRowProps {
	id: string;
	title: string;
	editHref: string;
	description?: string;
	imageUrl?: string;

	onDelete?: (id: string) => Promise<void>;
}

export const AdminItemRow = ({
	id,
	title,
	description,
	editHref,
	imageUrl,
	onDelete,
}: AlbumRowProps) => {
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
					<Image
						src={imageUrl}
						alt={title}
						fill
						placeholder="blur"
						blurDataURL={placeholderSvg}
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
					onDelete={onDelete}
				/>
			</ItemActions>
		</Item>
	);
};
