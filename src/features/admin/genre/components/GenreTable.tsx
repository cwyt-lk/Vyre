"use client";

import { useAction } from "next-safe-action/hooks";
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

	const { execute, isExecuting } = useAction(deleteGenreAction, {
		onSuccess: ({ input, data }) => {
			if (!data?.success) {
				toast.error(data?.error);
				return;
			}

			setGenres((prev) => prev.filter((it) => it.id !== input.id));

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
