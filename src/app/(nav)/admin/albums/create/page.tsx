import { Card, CardContent } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { AlbumForm } from "@/features/admin/album/components";
import { createRepositories } from "@/lib/factories/repository/server";

export default async function CreateAlbumPage() {
	const { tracks } = await createRepositories();

	const res = await tracks.findAll();

	if (!res.success) {
		return <ErrorState />;
	}

	return (
		<div className="relative min-h-screen">
			<Container className="flex flex-col items-center justify-center py-8">
				<Card className="w-full max-w-150">
					<CardContent>
						<AlbumForm
							tracks={res.data}
							options={{ mode: "create" }}
						/>
					</CardContent>
				</Card>
			</Container>
		</div>
	);
}
