"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { addArtist } from "@/features/admin/create/add-artist/action";
import {
	addArtistDefaultValues,
	addArtistSchema,
} from "@/features/admin/create/add-artist/schema";

/**
 * Hook for the Add Artist form
 */
export function useAddArtistForm() {
	const form = useForm({
		defaultValues: addArtistDefaultValues,
		validators: { onSubmit: addArtistSchema },
		onSubmit: async ({ value }) => {
			const result = await addArtist(value);

			if (!result.success) {
				toast.error(result.error);
				return;
			}

			form.reset();
			toast.success(`Added Artist: ${value.name}`);
		},
	});

	const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

	return { form, isSubmitting };
}
