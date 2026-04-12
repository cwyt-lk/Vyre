import { Container } from "@/components/layout/Container";
import { ErrorState } from "@/components/layout/ErrorState";
import { Card, CardContent } from "@/components/ui/Card";
import { ArtistForm } from "@/features/admin/artist/components/ArtistForm";
import { createRepositories } from "@/lib/factories/repository/server";

interface ArtistParamsType {
	params: Promise<{ id: string }>;
}

export default async function UpdateArtistsPage({
	params,
}: ArtistParamsType) {
	const { id } = await params;
	const { artists } = await createRepositories();

	const res = await artists.findById(id);

	if (!res.success) {
		return <ErrorState />;
	}

	return (
		<div className="relative min-h-screen">
			<Container className="flex flex-col items-center justify-center py-8">
				<Card className="w-full max-w-150">
					<CardContent>
						<ArtistForm
							options={{
								mode: "edit",
								initialData: {
									...res.data,
									bio: res.data.bio ?? undefined,
								},
							}}
						/>
					</CardContent>
				</Card>
			</Container>
		</div>
	);
}
