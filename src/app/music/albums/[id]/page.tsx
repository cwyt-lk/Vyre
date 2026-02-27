import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { AlbumClient } from "@/features/music/albums/AlbumClient";
import { createRepositories } from "@/lib/factories/server";

interface AlbumParamsType {
	params: Promise<{ id: string }>;
}

export default async function AlbumPage({ params }: AlbumParamsType) {
	const { id } = await params;

	const { albums, storage } = await createRepositories();
	const { data: album, error } = await albums.findById(id);

	if (error || !album) {
		notFound();
	}

	const { data: coverUrl } = storage.getPublicFile(
		"cover-art",
		album.coverPath,
	);

	return (
		<Container>
			<AlbumClient album={album} coverUrl={coverUrl} />
		</Container>
	);
}
