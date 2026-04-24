"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { signInAction } from "@/features/auth/sign-in/action";
import {
	signInDefaultValues,
	signInSchema,
} from "@/features/auth/sign-in/schema";

export function useSignInForm() {
	const router = useRouter();

	const { executeAsync, isExecuting } = useAction(signInAction, {
		onSuccess: ({ data }) => {
			if (!data?.success) {
				toast.error(data?.error);
				return;
			}

			router.replace("/home");
		},

		onError: () => {
			toast.error("Sign in failed. Please try again.");
		},
	});

	const form = useForm({
		defaultValues: signInDefaultValues,
		validators: {
			onSubmit: signInSchema,
		},
		onSubmit: async ({ value }) => {
			await executeAsync(value);
		},
	});

	const isSubmitting =
		useStore(form.store, (s) => s.isSubmitting) || isExecuting;

	return { form, isSubmitting };
}
