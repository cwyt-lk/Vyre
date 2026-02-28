import Link from "next/link";
import { Separator } from "@/components/ui/Separator";

interface SignInFooterProps {
	className?: string;
}

export function SignInFooter({ className }: SignInFooterProps) {
	return (
		<div className="flex flex-col gap-6 items-center justify-center">
			<Separator className={className} />

			<p className="text-sm text-muted-foreground">
				Don&apos;t have an account?{" "}
				<Link
					href="/auth/sign-up"
					className="font-medium text-primary underline-offset-4 hover:underline transition-colors"
				>
					Sign up
				</Link>
			</p>
		</div>
	);
}
