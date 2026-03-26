"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ItemGroup } from "@/components/ui/Item";
import { deleteAlbumAction } from "@/features/admin/album/actions/deleteAlbum";
import { AdminItemRow } from "@/features/admin/components";
import type { AlbumWithCover } from "@/lib/mappers/domain";
import { formatDate } from "@/lib/utils/time";

interface AlbumTableProps {
	albumList: AlbumWithCover[];
}

export const AlbumTable = ({ albumList }: AlbumTableProps) => {
	const [albums, setAlbums] = useState(albumList);

	useEffect(() => {
		setAlbums(albumList);
	}, [albumList]);

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
		<ItemGroup>
			{albums.map((album) => (
				<AdminItemRow
					key={album.id}
					id={album.id}
					title={album.title}
					description={formatDate(album.releaseDate)}
					onDelete={onDelete}
					editHref={`/admin/albums/update/${album.id}`}
					imageUrl={album.coverUrl}
				/>
			))}
		</ItemGroup>
	);
};
