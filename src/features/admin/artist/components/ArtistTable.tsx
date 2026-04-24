"use client";

import { useAction } from "next-safe-action/hooks";
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

	const { execute, isExecuting } = useAction(deleteArtistAction, {
		onSuccess: ({ input, data }) => {
			if (!data?.success) {
				toast.error(data?.error);
				return;
			}

			setArtists((prev) => prev.filter((it) => it.id !== input.id));

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
