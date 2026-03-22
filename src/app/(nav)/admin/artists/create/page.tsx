import { Container } from "@/components/layout/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { ArtistForm } from "@/features/admin/artist/components/ArtistForm";

export default async function AddArtistPage() {
	return (
		<div className="relative min-h-screen">
			<Container className="flex flex-col items-center justify-center py-8">
				<Card className="w-full max-w-150">
					<CardContent>
						<ArtistForm />
					</CardContent>
				</Card>
			</Container>
		</div>
	);
}
