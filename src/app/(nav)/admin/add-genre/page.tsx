import { Container } from "@/components/layout/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { AddGenreForm } from "@/features/admin/add-genre/components/AddGenreForm";

export default async function AddGenrePage() {
	return (
		<div className="relative min-h-screen">
			<Container className="flex flex-col items-center justify-center py-8">
				<Card className="w-full max-w-150">
					<CardContent>
						<AddGenreForm />
					</CardContent>
				</Card>
			</Container>
		</div>
	);
}
