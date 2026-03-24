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

interface AlbumRowProps {
	id: string;
	title: string;
	description: string;
	editHref: string;
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
			className="group transition duration-300 hover:bg-muted"
		>
			{imageUrl && (
				<ItemMedia variant="image" className="size-16">
					<Image
						src={imageUrl}
						alt={title}
						fill
						placeholder="blur"
						blurDataURL="/placeholder.png"
						className="object-cover transition-transform group-hover:scale-105"
					/>
				</ItemMedia>
			)}

			<ItemContent className="gap-1">
				<ItemTitle className="text-base font-semibold">
					{title}
				</ItemTitle>

				<ItemDescription>{description}</ItemDescription>
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
