"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ItemGroup } from "@/components/ui/Item";
import { AdminItemRow } from "@/features/admin/components";
import type { Artist } from "@/types/domain";
import { deleteArtistAction } from "../actions/deleteArtist";

interface ArtistTableProps {
	artistList: Artist[];
}

export const ArtistTable = ({ artistList }: ArtistTableProps) => {
	const [artists, setArtists] = useState(artistList);

	useEffect(() => {
		setArtists(artistList);
	}, [artistList]);

	const onDelete = async (id: string) => {
		const res = await deleteArtistAction(id);

		if (!res.success) {
			toast.error(res.error);
			return;
		}

		setArtists((prev) => prev.filter((it) => it.id !== id));

		toast.success("Successfully Deleted");
	};

	return (
		<ItemGroup>
			{artists.map((artist) => (
				<AdminItemRow
					key={artist.id}
					id={artist.id}
					title={artist.name}
					description={artist.bio ?? ""}
					onDelete={onDelete}
					editHref={`/admin/artists/update/${artist.id}`}
				/>
			))}
		</ItemGroup>
	);
};
