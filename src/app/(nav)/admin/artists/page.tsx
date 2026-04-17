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
		<div className="flex min-h-screen flex-col gap-2 p-6">
			<h1 className="mb-6 text-3xl font-bold">Artists</h1>

			<search className="mb-4 w-1/4">
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
