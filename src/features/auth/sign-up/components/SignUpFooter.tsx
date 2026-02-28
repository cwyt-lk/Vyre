import Link from "next/link";
import { Separator } from "@/components/ui/Separator";

interface SignUpFooterProps {
	className?: string;
}

export function SignUpFooter({ className }: SignUpFooterProps) {
	return (
		<div className="flex flex-col gap-6 items-center justify-center">
			<Separator className={className} />

			<p className="text-sm text-muted-foreground">
				Already have an account?{" "}
				<Link
					href="/auth/sign-in"
					className="font-medium text-primary underline-offset-4 hover:underline transition-colors"
				>
					Sign in
				</Link>
			</p>
		</div>
	);
}
