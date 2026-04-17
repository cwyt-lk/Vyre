import { ErrorState } from "@/components/layout/ErrorState";
import { SearchBar } from "@/components/ui/SearchBar";
import { AlbumTable } from "@/features/admin/album/components";
import { EmptyAlbumState } from "@/features/music/albums/components/EmptyAlbumState";
import { PaginationClient } from "@/features/pagination/PaginationClient";
import { createRepositories } from "@/lib/factories/repository/server";
import { AlbumMapper, type AlbumWithCover } from "@/lib/mappers/domain";
import {
	getPagination,
	getPaginationTotalPages,
	type PaginationInput,
} from "@/lib/utils/pagination";

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

	const { page, pageSize, from, to } = getPagination(resolvedParams);

	const res = await albums.searchByTitle(resolvedParams.query ?? "", {
		range: [from, to],
		order: {
			field: "title",
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

	const { items, count } = res.data;
	const totalPages = getPaginationTotalPages(pageSize, count);

	const albumList: AlbumWithCover[] = items.map((it) =>
		AlbumMapper.mapWithCover(it, storage),
	);

	if (albumList.length === 0) {
		return <EmptyAlbumState />;
	}

	return (
		<div className="flex min-h-screen flex-col gap-2 p-6">
			<h1 className="mb-6 text-3xl font-bold">Albums</h1>

			<search className="mb-4 w-1/4">
				<SearchBar placeholder="Search by title" />
			</search>

			<div className="flex flex-col gap-8">
				<AlbumTable albumList={albumList} />

				<PaginationClient
					currentPage={page}
					totalPages={totalPages}
				/>
			</div>
		</div>
	);
}
