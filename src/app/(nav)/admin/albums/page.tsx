import { ErrorState } from "@/components/layout/ErrorState";
import { AlbumTable } from "@/features/admin/album/components";
import { EmptyAlbumState } from "@/features/music/albums/components/EmptyAlbumState";
import { PaginationClient } from "@/features/pagination/PaginationClient";
import { createRepositories } from "@/lib/factories/repository/server";
import { AlbumMapper, type AlbumWithCover } from "@/lib/mappers/domain";
import {
	getPagination,
	type PaginationInput,
} from "@/lib/utils/pagination";

interface AdminAlbumsPageProps {
	searchParams?: Promise<PaginationInput>;
}

export default async function AdminAlbumsPage({
	searchParams,
}: AdminAlbumsPageProps) {
	const { albums, storage } = await createRepositories();
	const resolvedParams = await searchParams;

	if (!resolvedParams) {
		return <ErrorState />;
	}

	const { page, pageSize, from, to } = getPagination(resolvedParams, {
		page: 1,
		pageSize: 5,
	});

	const [countRes, res] = await Promise.all([
		albums.count(),
		albums.findAll({ range: [from, to] }),
	]);

	if (!res.success || !countRes.success) {
		return <ErrorState />;
	}

	const totalCount = countRes.data;
	const totalPages = Math.ceil(totalCount / pageSize);

	const albumList: AlbumWithCover[] = res.data.map((it) =>
		AlbumMapper.mapWithCover(it, storage),
	);

	if (albumList.length === 0) {
		return <EmptyAlbumState />;
	}

	return (
		<div className="min-h-screen p-6 space-y-2">
			<h1 className="text-3xl font-bold mb-6">Albums</h1>

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
