"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { signUpAction } from "@/features/auth/sign-up/actions";
import {
	signUpDefaultValues,
	signUpSchema,
} from "@/features/auth/sign-up/schema";

export function useSignUpForm() {
	const form = useForm({
		defaultValues: signUpDefaultValues,
		validators: {
			onSubmit: signUpSchema,
		},
		onSubmit: async ({ value }) => {
			await signUpAction(value);
		},
	});

	const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

	return { form, isSubmitting };
}
