"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { createGenreAction } from "@/features/admin/genre/actions/createGenre";
import {
	createGenreSchema,
	genreDefaultValues,
} from "@/features/admin/genre/schemas/createSchema";

/**
 * Hook for the Add Genre form
 */
export function useGenreForm() {
	const form = useForm({
		defaultValues: genreDefaultValues,
		validators: { onSubmit: createGenreSchema },
		onSubmit: async ({ value }) => {
			const result = await createGenreAction(value);

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
