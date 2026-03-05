"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { addArtist } from "@/features/admin/add-artist/action";
import {
	addArtistDefaultValues,
	addArtistSchema,
} from "@/features/admin/add-artist/schema";

export function useAddArtistForm() {
	const form = useForm({
		defaultValues: addArtistDefaultValues,
		validators: {
			onSubmit: addArtistSchema,
		},
		onSubmit: async ({ value }) => {
			const res = await addArtist(value);

			if (!res.success) {
				toast.error(res.error);
			} else {
				form.reset();

				toast.success(`Added Artist: ${value.name}`);
			}
		},
	});

	const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

	return { form, isSubmitting };
}
