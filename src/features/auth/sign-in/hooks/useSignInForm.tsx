"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
	signInDefaultValues,
	signInSchema,
} from "@/features/auth/sign-in/schema";
import { createRepositories } from "@/lib/factories/client";

export function useSignInForm() {
	const router = useRouter();
	const { auth } = createRepositories();

	const form = useForm({
		defaultValues: signInDefaultValues,
		validators: {
			onSubmit: signInSchema,
		},
		onSubmit: async ({ value }) => {
			const { error } = await auth.signIn(
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
