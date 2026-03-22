import { ErrorState } from "@/components/layout/ErrorState";
import { AlbumTable } from "@/features/admin/album/components";
import { EmptyAlbumState } from "@/features/music/albums/components/EmptyAlbumState";
import { createRepositories } from "@/lib/factories/repository/server";
import { AlbumMapper, type AlbumWithCover } from "@/lib/mappers/domain";

export default async function AdminAlbumsPage() {
	const { albums, storage } = await createRepositories();
	const res = await albums.findAll();

	if (!res.success) {
		return <ErrorState />;
	}

	const albumList: AlbumWithCover[] = res.data.map((it) =>
		AlbumMapper.mapWithCover(it, storage),
	);

	if (!albumList || albumList.length === 0) {
		return <EmptyAlbumState />;
	}

	return (
		<div className="min-h-screen p-6">
			<h1 className="text-3xl font-bold mb-6">Albums</h1>

			<AlbumTable albumList={albumList} />
		</div>
	);
}
