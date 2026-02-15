import Link from "next/link";
import { unauthorized } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Stack } from "@/components/layout/Stack";
import { Button } from "@/components/ui/Button";
import { SignOutButton } from "@/features/auth/sign-out/components/SignOutButton";
import { createRepositories } from "@/lib/factories/server";

export default async function HomePage() {
	const { auth } = await createRepositories();

	const { data: user } = await auth.getCurrentUser();

	if (!user) {
		unauthorized();
	}

	return (
		<Container className="py-6">
			<Stack justify="center" align="center">
				<h1>Welcome, {user?.fullName}</h1>

				<SignOutButton />
				<Link href="/music-list">
					<Button size="lg">Music-List</Button>
				</Link>
			</Stack>
		</Container>
	);
}
