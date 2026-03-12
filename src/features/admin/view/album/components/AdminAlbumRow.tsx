"use client";

import { Edit } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { AdminDeleteButton } from "@/features/admin/components/AdminDeleteButton";
import type { AlbumWithCover } from "@/lib/mappers/domain";

interface AdminAlbumRowProps {
	album: AlbumWithCover;
	onEdit?: (id: string) => Promise<void>;
	onDelete?: (id: string) => Promise<void>;
}

export const AdminAlbumRow = ({
	album,
	onEdit,
	onDelete,
}: AdminAlbumRowProps) => {
	return (
		<div
			className={`group flex items-center justify-between gap-4 rounded-xl border bg-card/50 p-3 transition-all
		        hover:bg-muted hover:shadow-sm`}
		>
			<div className="flex items-center gap-4 min-w-0">
				{/* Cover Art Container */}
				<div className="relative aspect-square size-14 shrink-0 overflow-hidden rounded-md border bg-muted">
					<Image
						src={album.coverUrl ?? "/placeholder.png"}
						alt={`${album.title} album cover`}
						fill
						className="object-cover transition-transform group-hover:scale-105"
					/>
				</div>

				{/* Text Metadata */}
				<div className="flex flex-col truncate">
					<h3 className="truncate font-medium leading-none text-foreground">
						{album.title}
					</h3>

					<time
						dateTime={album.releaseDate.toISOString()}
						className="mt-1 text-xs text-muted-foreground"
					>
						{album.releaseDate.toLocaleDateString(undefined, {
							year: "numeric",
							month: "short",
							day: "numeric",
						})}
					</time>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex items-center gap-2">
				<Button
					variant="ghost"
					size="icon"
					className="size-8 text-muted-foreground hover:text-primary"
					onClick={() => onEdit?.(album.id)}
					aria-label="Edit album"
				>
					<Edit className="size-5" />
				</Button>

				<AdminDeleteButton
					id={album.id}
					title={album.title}
					onDelete={onDelete}
				/>
			</div>
		</div>
	);
};
