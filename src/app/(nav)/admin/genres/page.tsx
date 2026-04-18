import { Film, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SearchBar } from "@/components/ui/SearchBar";
import { GenreTable } from "@/features/admin/genre/components/GenreTable";
import { PaginationClient } from "@/features/pagination/PaginationClient";
import { createRepositories } from "@/lib/factories/repository/server";
import { paginatedSearch } from "@/lib/utils/paginated-search";
import type { PaginationInput } from "@/lib/utils/pagination";

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

	const res = await paginatedSearch({
		query: resolvedParams.query,
		params: resolvedParams,
		searchFn: (query, options) => genres.searchByKey(query, options),
		queryOptions: {
			order: {
				field: "key",
				direction: "asc",
			},
		},
	});

	if (!res.success) {
		return (
			<ErrorState
				message={res.error.message}
				code={res.error.code}
			/>
		);
	}

	const { items: genreList, page, totalPages } = res;

	return (
		<div className="flex min-h-screen flex-col gap-2 p-6">
			<h1 className="mb-6 text-3xl font-bold">Genres</h1>

			<search className="mb-4 w-1/4">
				<SearchBar placeholder="Search by title" />
			</search>

			{genreList.length === 0 ? (
				resolvedParams.query ? (
					<EmptyState
						icon={<Search className="size-16" />}
						title="No results found"
						description="Try adjusting your search or filters."
					/>
				) : (
					<EmptyState
						icon={<Film className="size-16" />}
						title="No genres yet"
						description="Start by adding a new genre."
					/>
				)
			) : (
				<div className="flex flex-col gap-8">
					<GenreTable genreList={genreList} />

					<PaginationClient
						currentPage={page}
						totalPages={totalPages}
					/>
				</div>
			)}
		</div>
	);
}
