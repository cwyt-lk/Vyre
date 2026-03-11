"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { addGenre } from "@/features/admin/add-genre/action";
import {
	addGenreDefaultValues,
	addGenreSchema,
} from "@/features/admin/add-genre/schema";

/**
 * Hook for the Add Genre form
 */
export function useAddGenreForm() {
	const form = useForm({
		defaultValues: addGenreDefaultValues,
		validators: { onSubmit: addGenreSchema },
		onSubmit: async ({ value }) => {
			const result = await addGenre(value);

			if (!result.success) {
				toast.error(result.error);
				return;
			}

			form.reset();
			toast.success(`Created Genre: ${value.label}`);
		},
	});

	const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

	return { form, isSubmitting };
}
