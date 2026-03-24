import { Container } from "@/components/layout/Container";
import { ErrorState } from "@/components/layout/ErrorState";
import { Card, CardContent } from "@/components/ui/Card";
import { AlbumForm } from "@/features/admin/album/components";
import { TrackForm } from "@/features/admin/track/components/TrackForm";
import { createRepositories } from "@/lib/factories/repository/server";

interface TrackParamsType {
	params: Promise<{ id: string }>;
}

export default async function UpdateTrackPage({
	params,
}: TrackParamsType) {
	const { id } = await params;
	const { tracks, genres, artists } = await createRepositories();

	const [trackRes, artistRes, genreRes] = await Promise.all([
		tracks.findByIdWithRelations(id),
		artists.findAll(),
		genres.findAll(),
	]);

	if (!trackRes.success || !artistRes.success || !genreRes.success) {
		return <ErrorState />;
	}

	const initialTrackArtists = trackRes.data.artists.map((it) => it.id);

	return (
		<div className="relative min-h-screen">
			<Container className="flex flex-col items-center justify-center py-8">
				<Card className="w-full max-w-150">
					<CardContent>
						<TrackForm
							genres={genreRes.data}
							artists={artistRes.data}
							options={{
								mode: "edit",
								initialData: {
									...trackRes.data,
									artistIds: initialTrackArtists,
								},
							}}
						/>
					</CardContent>
				</Card>
			</Container>
		</div>
	);
}
