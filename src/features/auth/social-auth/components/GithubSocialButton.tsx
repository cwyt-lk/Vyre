"use client";

import { useAction } from "next-safe-action/hooks";
import { FaGithub } from "react-icons/fa6";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { signInWithGithubAction } from "@/features/auth/social-auth/actions";

export const GithubSocialButton = () => {
	const { execute, isExecuting } = useAction(signInWithGithubAction, {
		onSuccess: ({ data }) => {
			if (!data?.success) {
				toast.error(
					data?.error ?? "Failed to sign in with GitHub",
				);
			}
		},
		onError: () => {
			toast.error("Something went wrong. Please try again.");
		},
	});

	return (
		<Button
			variant="outline"
			size="lg"
			type="button"
			disabled={isExecuting}
			onClick={() => execute()}
			className="flex items-center justify-center gap-4"
		>
			{isExecuting ? (
				<Spinner className="size-6" />
			) : (
				<FaGithub className="size-6" />
			)}

			<span>
				{isExecuting
					? "Continuing with GitHub..."
					: "Continue with GitHub"}
			</span>
		</Button>
	);
};
