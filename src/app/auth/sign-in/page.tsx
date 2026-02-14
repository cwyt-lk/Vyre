import { Container } from "@/components/layout/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { SignInForm } from "@/features/auth/sign-in/components/SignInForm";

export default async function SignInPage() {
	return (
		<Container className="max-w-2xl py-4">
			<Card>
				<CardContent>
					<SignInForm />
				</CardContent>
			</Card>
		</Container>
	);
}
