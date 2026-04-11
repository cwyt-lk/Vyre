import { ErrorState } from "@/components/layout/ErrorState";
import { SearchBar } from "@/components/ui/SearchBar";
import { ArtistTable } from "@/features/admin/artist/components/ArtistTable";
import { EmptyAlbumState } from "@/features/music/albums/components/EmptyAlbumState";
import { PaginationClient } from "@/features/pagination/PaginationClient";
import { createRepositories } from "@/lib/factories/repository/server";
import {
	getPagination,
	getPaginationTotalPages,
	type PaginationInput,
} from "@/lib/utils/pagination";

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

	const { page, pageSize, from, to } = getPagination(resolvedParams);

	const res = await artists.searchByName(resolvedParams.query ?? "", {
		range: [from, to],
		order: {
			field: "name",
			direction: "asc",
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

	const { items: artistList, count } = res.data;
	const totalPages = getPaginationTotalPages(pageSize, count);

	if (artistList.length === 0) {
		return <EmptyAlbumState />;
	}

	return (
		<div className="min-h-screen p-6 space-y-2">
			<h1 className="text-3xl font-bold mb-6">Artists</h1>

			<search className="w-1/4 mb-4">
				<SearchBar placeholder="Search by title" />
			</search>

			<div className="flex flex-col gap-8">
				<ArtistTable artistList={artistList} />

				<PaginationClient
					currentPage={page}
					totalPages={totalPages}
				/>
			</div>
		</div>
	);
}
