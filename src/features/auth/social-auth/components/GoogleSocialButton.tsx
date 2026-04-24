"use client";

import { useAction } from "next-safe-action/hooks";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { signInWithGoogleAction } from "@/features/auth/social-auth/actions";

export const GoogleSocialButton = () => {
	const { execute, isExecuting } = useAction(signInWithGoogleAction, {
		onSuccess: ({ data }) => {
			if (!data?.success) {
				toast.error(
					data?.error ?? "Failed to sign in with Google",
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
				<FcGoogle className="size-6" />
			)}
			<span>
				{isExecuting
					? "Continuing with Google..."
					: "Continue with Google"}
			</span>
		</Button>
	);
};
