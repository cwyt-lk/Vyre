import { Container } from "@/components/layout/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { SignInForm } from "@/features/auth/sign-in/components/SignInForm";

export default async function SignInPage() {
	return (
		<div className="relative min-h-screen">
			<Container className="flex flex-col items-center justify-center py-8">
				<Card className="w-full max-w-150">
					<CardContent>
						<SignInForm />
					</CardContent>
				</Card>
			</Container>
		</div>
	);
}
