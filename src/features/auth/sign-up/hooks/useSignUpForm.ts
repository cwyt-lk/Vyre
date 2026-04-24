"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { signUpAction } from "@/features/auth/sign-up/actions";
import {
	signUpDefaultValues,
	signUpSchema,
} from "@/features/auth/sign-up/schema";

export function useSignUpForm() {
	const { executeAsync, isExecuting } = useAction(signUpAction, {
		onSuccess: ({ data }) => {
			if (!data?.success) {
				toast.error(
					data?.error ?? "Sign up failed. Please try again.",
				);
				return;
			}

			toast.success("Account created! Check your email to verify.");
		},

		onError: () => {
			toast.error("Something went wrong. Please try again.");
		},
	});

	const form = useForm({
		defaultValues: signUpDefaultValues,
		validators: {
			onSubmit: signUpSchema,
		},
		onSubmit: async ({ value }) => {
			await executeAsync(value);
		},
	});

	const isSubmitting =
		useStore(form.store, (s) => s.isSubmitting) || isExecuting;

	return { form, isSubmitting };
}
