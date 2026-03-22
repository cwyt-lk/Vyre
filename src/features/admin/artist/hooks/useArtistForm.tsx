"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { createArtistAction } from "@/features/admin/artist/actions/createArtist";
import {
	artistDefaultValues,
	createArtistSchema,
} from "@/features/admin/artist/schemas/createSchema";

/**
 * Hook for the Add Artist form
 */
export function useArtistForm() {
	const form = useForm({
		defaultValues: artistDefaultValues,
		validators: { onSubmit: createArtistSchema },
		onSubmit: async ({ value }) => {
			const result = await createArtistAction(value);

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
