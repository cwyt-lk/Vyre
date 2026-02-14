"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
	signUpDefaultValues,
	signUpSchema,
} from "@/features/auth/sign-up/schema";
import { createRepositories } from "@/lib/factories/client";

export function useSignUpForm() {
	const router = useRouter();
	const { auth } = createRepositories();

	const form = useForm({
		defaultValues: signUpDefaultValues,
		validators: {
			onSubmit: signUpSchema,
		},
		onSubmit: async ({ value }) => {
			const { error } = await auth.signUp(
				value.email,
				value.password,
			);

			if (error) {
				toast.error(error.message);
			} else {
				router.replace("/home");
			}
		},
	});

	const isSubmitting = useStore(
		form.store,
		(state) => state.isSubmitting,
	);

	return { form, isSubmitting };
}
