"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteAlbumAction } from "@/features/admin/album/actions/deleteAlbum";
import { AlbumRow } from "@/features/admin/album/components";
import type { AlbumWithCover } from "@/lib/mappers/domain";

interface AlbumTableProps {
	albumList: AlbumWithCover[];
}

export const AlbumTable = ({ albumList }: AlbumTableProps) => {
	const [albums, setAlbums] = useState(albumList);

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
				<AlbumRow
					key={album.title + album.releaseDate.toString()}
					album={album}
					onDelete={onDelete}
				/>
			))}
		</div>
	);
};
