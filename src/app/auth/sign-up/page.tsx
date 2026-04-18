import { Card, CardContent } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SignUpForm } from "@/features/auth/sign-up/components/SignUpForm";

export default async function SignUpPage() {
	return (
		<div className="relative min-h-screen">
			<Container className="flex flex-col items-center justify-center py-8">
				<Card className="w-full max-w-150">
					<CardContent>
						<SignUpForm />
					</CardContent>
				</Card>
			</Container>
		</div>
	);
}
