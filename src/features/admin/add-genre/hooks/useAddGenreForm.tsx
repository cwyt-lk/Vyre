"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { addGenre } from "@/features/admin/add-genre/action";
import {
	addGenreDefaultValues,
	addGenreSchema,
} from "@/features/admin/add-genre/schema";

export function useAddGenreForm() {
	const form = useForm({
		defaultValues: addGenreDefaultValues,
		validators: {
			onSubmit: addGenreSchema,
		},
		onSubmit: async ({ value }) => {
			const res = await addGenre(value);

			if (!res.success) {
				toast.error(res.error);
			} else {
				form.reset();

				toast.success(`Created Genre: ${value.label}`);
			}
		},
	});

	const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

	return { form, isSubmitting };
}
