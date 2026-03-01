import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { AlbumClient } from "@/features/music/albums/AlbumClient";
import { createRepositories } from "@/lib/factories/repository/server";

interface AlbumParamsType {
	params: Promise<{ id: string }>;
}

export default async function AlbumPage({ params }: AlbumParamsType) {
	const { id } = await params;

	const { albums, storage } = await createRepositories();
	const albumResult = await albums.findById(id);

	if (!albumResult.success) {
		notFound();
	}

	const album = albumResult.data;

	const storageResult = storage.getPublicFile(
		"cover-art",
		album.coverPath,
	);

	const coverUrl = storageResult.success ? storageResult.data : "";

	return (
		<Container>
			<AlbumClient album={album} coverUrl={coverUrl} />
		</Container>
	);
}
