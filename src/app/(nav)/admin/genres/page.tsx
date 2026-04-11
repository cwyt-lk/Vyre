import { ErrorState } from "@/components/layout/ErrorState";
import { SearchBar } from "@/components/ui/SearchBar";
import { GenreTable } from "@/features/admin/genre/components/GenreTable";
import { EmptyAlbumState } from "@/features/music/albums/components/EmptyAlbumState";
import { PaginationClient } from "@/features/pagination/PaginationClient";
import { createRepositories } from "@/lib/factories/repository/server";
import {
	getPagination,
	getPaginationTotalPages,
	type PaginationInput,
} from "@/lib/utils/pagination";
import { slugify } from "@/lib/utils/string";

interface AdminGenresPageProps {
	searchParams?: Promise<{ query?: string } & PaginationInput>;
}

export default async function AdminGenresPage({
	searchParams,
}: AdminGenresPageProps) {
	const { genres } = await createRepositories();
	const resolvedParams = await searchParams;

	if (!resolvedParams) {
		return <ErrorState />;
	}

	const { page, pageSize, from, to } = getPagination(resolvedParams);

	const res = await genres.searchByKey(
		slugify(resolvedParams.query ?? ""),
		{
			range: [from, to],
			order: {
				field: "label",
				direction: "asc",
			},
		},
	);

	if (!res.success) {
		return (
			<ErrorState
				message={res.error.message}
				code={res.error.code}
			/>
		);
	}

	const { items: genreList, count } = res.data;
	const totalPages = getPaginationTotalPages(pageSize, count);

	if (genreList.length === 0) {
		return <EmptyAlbumState />;
	}

	return (
		<div className="min-h-screen p-6 space-y-2">
			<h1 className="text-3xl font-bold mb-6">Genres</h1>

			<search className="w-1/4 mb-4">
				<SearchBar placeholder="Search by title" />
			</search>

			<div className="flex flex-col gap-8">
				<GenreTable genreList={genreList} />

				<PaginationClient
					currentPage={page}
					totalPages={totalPages}
				/>
			</div>
		</div>
	);
}
