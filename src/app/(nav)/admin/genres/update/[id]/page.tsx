import { Container } from "@/components/layout/Container";
import { ErrorState } from "@/components/layout/ErrorState";
import { Card, CardContent } from "@/components/ui/Card";
import { GenreForm } from "@/features/admin/genre/components/GenreForm";
import { createRepositories } from "@/lib/factories/repository/server";

interface GenreParamsType {
	params: Promise<{ id: string }>;
}

export default async function UpdateGenrePage({
	params,
}: GenreParamsType) {
	const { id } = await params;
	const { genres } = await createRepositories();

	const res = await genres.findById(id);

	if (!res.success) {
		return <ErrorState />;
	}

	return (
		<div className="relative min-h-screen">
			<Container className="flex flex-col items-center justify-center py-8">
				<Card className="w-full max-w-150">
					<CardContent>
						<GenreForm
							options={{
								mode: "edit",
								initialData: res.data,
							}}
						/>
					</CardContent>
				</Card>
			</Container>
		</div>
	);
}
