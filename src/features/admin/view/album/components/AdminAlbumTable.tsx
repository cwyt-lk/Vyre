"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteAlbumAction } from "@/features/admin/view/album/action";
import { AdminAlbumRow } from "@/features/admin/view/album/components/AdminAlbumRow";
import type { AlbumWithCover } from "@/lib/mappers/domain";

interface AdminAlbumTableProps {
	albumList: AlbumWithCover[];
}

export const AdminAlbumTable = ({ albumList }: AdminAlbumTableProps) => {
	const [albums, setAlbums] = useState(albumList);

	const onEdit = async (id: string) => {};

	const onDelete = async (id: string) => {
		const res = await deleteAlbumAction(id);

		if (!res.success) {
			toast.error(res.error);
			return;
		}

		setAlbums((prev) => prev.filter((it) => it.id !== id));

		toast.success("Successfully Deleted");
	};

	return (
		<div className="flex flex-col gap-4">
			{albums.map((album) => (
				<AdminAlbumRow
					key={album.title + album.releaseDate.toString()}
					album={album}
					onEdit={onEdit}
					onDelete={onDelete}
				/>
			))}
		</div>
	);
};
