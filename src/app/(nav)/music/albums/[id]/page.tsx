import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { AlbumClient } from "@/features/music/albums/container/AlbumClient";
import { createRepositories } from "@/lib/factories/repository/server";
import {
	AlbumMapper,
	type AlbumWithCover,
	type TrackAggregateWithAudio,
	TrackMapper,
} from "@/lib/mappers/domain";

interface AlbumParamsType {
	params: Promise<{ id: string }>;
}

export default async function AlbumPage({ params }: AlbumParamsType) {
	const { id } = await params;

	const { albums, storage } = await createRepositories();
	const albumResult = await albums.findByIdWithRelations(id);

	if (!albumResult.success) {
		notFound();
	}

	const album: AlbumWithCover = AlbumMapper.mapWithCover(
		albumResult.data,
		storage,
	);

	const tracks: TrackAggregateWithAudio[] = albumResult.data.tracks.map(
		(it) => TrackMapper.mapWithAudio(it, storage),
	);

	return (
		<Container>
			<AlbumClient album={album} tracks={tracks} />
		</Container>
	);
}
