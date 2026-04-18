import { Music, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SearchBar } from "@/components/ui/SearchBar";
import { TrackTable } from "@/features/admin/track/components/TrackTable";
import { PaginationClient } from "@/features/pagination/PaginationClient";
import { createRepositories } from "@/lib/factories/repository/server";
import { paginatedSearch } from "@/lib/utils/paginated-search";
import type { PaginationInput } from "@/lib/utils/pagination";

interface AdminTracksPageProps {
	searchParams?: Promise<{ query?: string } & PaginationInput>;
}

export default async function AdminTracksPage({
	searchParams,
}: AdminTracksPageProps) {
	const { tracks } = await createRepositories();
	const resolvedParams = await searchParams;

	if (!resolvedParams) {
		return <ErrorState />;
	}

	const res = await paginatedSearch({
		query: resolvedParams.query,
		params: resolvedParams,
		searchFn: (query, options) =>
			tracks.searchByTitleWithRelations(query, options),

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

	const { items: trackList, page, totalPages } = res;

	return (
		<div className="min-h-screen p-6">
			<h1 className="mb-6 text-3xl font-bold">Tracks</h1>

			<search className="mb-4 w-1/4">
				<SearchBar placeholder="Search by title" />
			</search>

			{trackList.length === 0 ? (
				resolvedParams.query ? (
					<EmptyState
						icon={<Search className="size-16" />}
						title="No results found"
						description="Try adjusting your search or filters."
					/>
				) : (
					<EmptyState
						icon={<Music className="size-16" />}
						title="No tracks yet"
						description="Start by adding a new track."
					/>
				)
			) : (
				<div className="flex flex-col gap-8">
					<TrackTable trackList={trackList} />

					<PaginationClient
						currentPage={page}
						totalPages={totalPages}
					/>
				</div>
			)}
		</div>
	);
}
