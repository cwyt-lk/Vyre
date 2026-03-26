import { Container } from "@/components/layout/Container";
import { ErrorState } from "@/components/layout/ErrorState";
import { Card, CardContent } from "@/components/ui/Card";
import { AlbumForm } from "@/features/admin/album/components";
import { createRepositories } from "@/lib/factories/repository/server";

interface AlbumParamsType {
	params: Promise<{ id: string }>;
}

export default async function UpdateAlbumPage({
	params,
}: AlbumParamsType) {
	const { id } = await params;
	const { tracks, albums } = await createRepositories();

	const [albumRes, tracksRes] = await Promise.all([
		await albums.findByIdWithRelations(id),
		await tracks.findAll(),
	]);

	if (!albumRes.success || !tracksRes.success) {
		return <ErrorState />;
	}

	const albumTrackIds = albumRes.data.tracks.map((track) => track.id);

	return (
		<div className="relative min-h-screen">
			<Container className="flex flex-col items-center justify-center py-8">
				<Card className="w-full max-w-150">
					<CardContent>
						<AlbumForm
							tracks={tracksRes.data}
							options={{
								mode: "edit",
								initialData: {
									...albumRes.data,
									trackIds: albumTrackIds,
								},
							}}
						/>
					</CardContent>
				</Card>
			</Container>
		</div>
	);
}
