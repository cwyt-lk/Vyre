import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

export function SignUpFooter() {
	return (
		<Field className="mt-6 text-sm">
			<div className="flex flex-col items-center justify-between gap-4">
				<span className="text-muted-foreground">
					Already have an account?
				</span>
				<Link href="/auth/sign-in">
					<Button type="button" variant="ghost">
						Sign In
					</Button>
				</Link>
			</div>
		</Field>
	);
}
