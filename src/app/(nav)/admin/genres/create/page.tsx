import { Container } from "@/components/layout/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { GenreForm } from "@/features/admin/genre/components/GenreForm";

export default async function AddGenrePage() {
	return (
		<div className="relative min-h-screen">
			<Container className="flex flex-col items-center justify-center py-8">
				<Card className="w-full max-w-150">
					<CardContent>
						<GenreForm options={{ mode: "create" }} />
					</CardContent>
				</Card>
			</Container>
		</div>
	);
}
