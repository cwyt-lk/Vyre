"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { signInWithGoogleAction } from "@/features/auth/social-auth/actions";

export const GoogleSocialButton = () => {
	const [isLoading, setIsLoading] = useState(false);

	const handleSignIn = async () => {
		try {
			setIsLoading(true);
			await signInWithGoogleAction();
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
			<FcGoogle className="size-6" />
			<span>
				{isLoading
					? "Continuing with Google..."
					: "Continue with Google"}
			</span>
		</Button>
	);
};
