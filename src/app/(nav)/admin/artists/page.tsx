import { Search, User } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SearchBar } from "@/components/ui/SearchBar";
import { ArtistTable } from "@/features/admin/artist/components/ArtistTable";
import { PaginationClient } from "@/features/pagination/PaginationClient";
import { createRepositories } from "@/lib/factories/repository/server";
import { paginatedSearch } from "@/lib/utils/paginated-search";
import type { PaginationInput } from "@/lib/utils/pagination";

interface AdminArtistsPageProps {
	searchParams?: Promise<{ query?: string } & PaginationInput>;
}

export default async function AdminArtistsPage({
	searchParams,
}: AdminArtistsPageProps) {
	const { artists } = await createRepositories();
	const resolvedParams = await searchParams;

	if (!resolvedParams) {
		return <ErrorState />;
	}

	const res = await paginatedSearch({
		query: resolvedParams.query,
		params: resolvedParams,
		searchFn: (query, options) => artists.searchByName(query, options),
		queryOptions: {
			order: {
				field: "name",
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

	const { items: artistList, page, totalPages } = res;

	return (
		<div className="flex min-h-screen flex-col gap-2 p-6">
			<h1 className="mb-6 text-3xl font-bold">Artists</h1>

			<search className="mb-4 w-1/4">
				<SearchBar placeholder="Search by title" />
			</search>

			{artistList.length === 0 ? (
				resolvedParams.query ? (
					<EmptyState
						icon={<Search className="size-16" />}
						title="No results found"
						description="Try adjusting your search or filters."
					/>
				) : (
					<EmptyState
						icon={<User className="size-16" />}
						title="No artists yet"
						description="Start by adding a new artist."
					/>
				)
			) : (
				<div className="flex flex-col gap-8">
					<ArtistTable artistList={artistList} />

					<PaginationClient
						currentPage={page}
						totalPages={totalPages}
					/>
				</div>
			)}
		</div>
	);
}
