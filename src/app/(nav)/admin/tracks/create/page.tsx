import { Card, CardContent } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { TrackForm } from "@/features/admin/track/components/TrackForm";
import { createRepositories } from "@/lib/factories/repository/server";

export default async function AddTrackPage() {
	const { genres, artists } = await createRepositories();

	const [artistRes, genreRes] = await Promise.all([
		artists.findAll(),
		genres.findAll(),
	]);

	if (!artistRes.success || !genreRes.success) {
		return <ErrorState />;
	}

	return (
		<div className="relative min-h-screen">
			<Container className="flex flex-col items-center justify-center py-8">
				<Card className="w-full max-w-150">
					<CardContent>
						<TrackForm
							genres={genreRes.data}
							artists={artistRes.data}
							options={{ mode: "create" }}
						/>
					</CardContent>
				</Card>
			</Container>
		</div>
	);
}
