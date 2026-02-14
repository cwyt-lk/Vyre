import { Container } from "@/components/layout/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { SignUpForm } from "@/features/auth/sign-up/components/SignUpForm";

export default async function SignInPage() {
	return (
		<Container className="max-w-2xl py-4">
			<Card>
				<CardContent>
					<SignUpForm />
				</CardContent>
			</Card>
		</Container>
	);
}
