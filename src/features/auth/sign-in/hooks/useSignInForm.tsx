"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInAction } from "@/features/auth/sign-in/action";
import {
	signInDefaultValues,
	signInSchema,
} from "@/features/auth/sign-in/schema";

export function useSignInForm() {
	const router = useRouter();

	const form = useForm({
		defaultValues: signInDefaultValues,
		validators: {
			onSubmit: signInSchema,
		},
		onSubmit: async ({ value }) => {
			const res = await signInAction(value);

			if (!res.success) {
				toast.error(res.error);
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
