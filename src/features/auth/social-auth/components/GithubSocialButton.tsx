"use client";

import { useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { signInWithGithubAction } from "@/features/auth/social-auth/actions";

export const GithubSocialButton = () => {
	const [isLoading, setIsLoading] = useState(false);

	const handleSignIn = async () => {
		try {
			setIsLoading(true);

			await signInWithGithubAction();
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			variant="outline"
			size="lg"
			type="button"
			disabled={isLoading}
			onClick={handleSignIn}
			className="flex items-center justify-center gap-4"
		>
			{isLoading && <Spinner className="size-5" />}
			<FaGithub className="size-6" />
			<span>
				{isLoading
					? "Continuing with GitHub..."
					: "Continue with GitHub"}
			</span>
		</Button>
	);
};
