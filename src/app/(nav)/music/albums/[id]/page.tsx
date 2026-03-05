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
	const albumResult = await albums.findWithRelationsById(id);

	if (!albumResult.success) {
		notFound();
	}

	const album = albumResult.data;

	let imageSrc = "/placeholder.png";

	if (album.coverUrl) {
		const storageResult = storage.getPublicFile(
			"cover-art",
			album.coverUrl,
		);

		if (storageResult.success) {
			imageSrc = storageResult.data;
		}
	}

	return (
		<Container>
			<AlbumClient
				album={album}
				albumTracks={album.tracks}
				coverUrl={imageSrc}
			/>
		</Container>
	);
}
