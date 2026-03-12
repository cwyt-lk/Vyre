import { Container } from "@/components/layout/Container";
import ErrorState from "@/components/layout/ErrorState";
import { Card, CardContent } from "@/components/ui/Card";
import { AddTrackForm } from "@/features/admin/create/add-track/components/AddTrackForm";
import { createRepositories } from "@/lib/factories/repository/server";

export default async function AddTrackPage() {
	const { genres, artists } = await createRepositories();

	const artistRes = await artists.findAll();
	const genreRes = await genres.findAll();

	if (!artistRes.success || !genreRes.success) {
		return <ErrorState />;
	}

	return (
		<div className="relative min-h-screen">
			<Container className="flex flex-col items-center justify-center py-8">
				<Card className="w-full max-w-150">
					<CardContent>
						<AddTrackForm
							genres={genreRes.data}
							artists={artistRes.data}
						/>
					</CardContent>
				</Card>
			</Container>
		</div>
	);
}
