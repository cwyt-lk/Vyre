"use client";

import { useAction } from "next-safe-action/hooks";
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

	const { execute, isExecuting } = useAction(deleteAlbumAction, {
		onSuccess: ({ input, data }) => {
			if (!data?.success) {
				toast.error(data?.error);
				return;
			}

			setAlbums((prev) => prev.filter((it) => it.id !== input.id));

			toast.success("Successfully Deleted");
		},

		onError: () => {
			toast.error("Something went wrong. Please try again.");
		},
	});

	const onDelete = (id: string) => {
		execute({ id });
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
