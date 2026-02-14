import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

export function SignInFooter() {
	return (
		<Field className="mt-6 text-sm">
			<div className="flex flex-col items-center justify-between gap-4">
				<span className="text-muted-foreground">
					Don’t have an account?
				</span>
				<Link href="/auth/sign-up">
					<Button type="button" variant="ghost">
						Sign Up
					</Button>
				</Link>
			</div>
		</Field>
	);
}
