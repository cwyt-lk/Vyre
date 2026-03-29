"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ItemGroup } from "@/components/ui/Item";
import { AdminItemRow } from "@/features/admin/components";
import type { Genre } from "@/types/domain";
import { deleteGenreAction } from "../actions/deleteGenre";

interface GenreTableProps {
	genreList: Genre[];
}

export const GenreTable = ({ genreList }: GenreTableProps) => {
	const [genres, setGenres] = useState(genreList);

	useEffect(() => {
		setGenres(genreList);
	}, [genreList]);

	const onDelete = async (id: string) => {
		const res = await deleteGenreAction(id);

		if (!res.success) {
			toast.error(res.error);
			return;
		}

		setGenres((prev) => prev.filter((it) => it.id !== id));

		toast.success("Successfully Deleted");
	};

	return (
		<ItemGroup>
			{genres.map((genre) => (
				<AdminItemRow
					key={genre.id}
					id={genre.id}
					title={genre.label}
					onDelete={onDelete}
					editHref={`/admin/genres/update/${genre.id}`}
				/>
			))}
		</ItemGroup>
	);
};
