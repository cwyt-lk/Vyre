import { Album, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SearchBar } from "@/components/ui/SearchBar";
import { AlbumTable } from "@/features/admin/album/components";
import { PaginationClient } from "@/features/pagination/PaginationClient";
import { createRepositories } from "@/lib/factories/repository/server";
import { AlbumMapper, type AlbumWithCover } from "@/lib/mappers/domain";
import { paginatedSearch } from "@/lib/utils/paginated-search";
import type { PaginationInput } from "@/lib/utils/pagination";

interface AdminAlbumsPageProps {
	searchParams?: Promise<{ query?: string } & PaginationInput>;
}

export default async function AdminAlbumsPage({
	searchParams,
}: AdminAlbumsPageProps) {
	const { albums, storage } = await createRepositories();
	const resolvedParams = await searchParams;

	if (!resolvedParams) {
		return <ErrorState />;
	}

	const res = await paginatedSearch({
		query: resolvedParams.query,
		params: resolvedParams,
		searchFn: (query, options) => albums.searchByTitle(query, options),
		queryOptions: {
			order: {
				field: "title",
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

	const { items, page, totalPages } = res;

	const albumList: AlbumWithCover[] = items.map((it) =>
		AlbumMapper.mapWithCover(it, storage),
	);

	return (
		<div className="flex min-h-screen flex-col gap-2 p-6">
			<h1 className="mb-6 text-3xl font-bold">Albums</h1>

			<div className="mb-4 w-1/4">
				<SearchBar placeholder="Search by title" />
			</div>

			{albumList.length === 0 ? (
				resolvedParams.query ? (
					<EmptyState
						icon={<Search className="size-16" />}
						title="No results found"
						description="Try adjusting your search or filters."
					/>
				) : (
					<EmptyState
						icon={<Album className="size-16" />}
						title="No albums yet"
						description="Start by adding a new album."
					/>
				)
			) : (
				<div className="flex flex-col gap-8">
					<AlbumTable albumList={albumList} />

					<PaginationClient
						currentPage={page}
						totalPages={totalPages}
					/>
				</div>
			)}
		</div>
	);
}
