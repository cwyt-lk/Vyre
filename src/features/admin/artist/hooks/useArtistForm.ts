"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { createArtistAction } from "../actions/createArtist";
import { updateArtistAction } from "../actions/updateArtist";
import {
	artistDefaultValues,
	type CreateArtistInput,
	createArtistSchema,
} from "../schemas/createSchema";
import type { UpdateArtistInput } from "./../schemas/updateSchema";
import { updateArtistSchema } from "../schemas/updateSchema";

export type UseArtistFormOptions =
	| {
			mode: "create";
	  }
	| {
			mode: "edit";
			initialData: UpdateArtistInput;
	  };

export function useArtistForm(options: UseArtistFormOptions) {
	const defaultValues =
		options.mode === "create"
			? artistDefaultValues
			: {
					...artistDefaultValues,
					...options.initialData,
				};

	const schema =
		options.mode === "create"
			? createArtistSchema
			: updateArtistSchema;

	const form = useForm({
		defaultValues: defaultValues,
		validators: {
			onSubmit: schema,
		},

		onSubmit: async ({ value }) => {
			if (options.mode === "create") {
				const success = await handleCreate(
					value as CreateArtistInput,
				);

				if (success) form.reset();
			} else {
				await handleUpdate(value as UpdateArtistInput);
			}
		},
	});

	const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

	return { form, isSubmitting };
}

async function handleCreate(value: CreateArtistInput) {
	const result = await createArtistAction(value);

	if (!result.success) {
		toast.error(result.error);

		return false;
	}

	toast.success("Successfully Created Artist");

	return true;
}

async function handleUpdate(value: UpdateArtistInput) {
	const result = await updateArtistAction(value);

	if (!result.success) {
		toast.error(result.error);

		return false;
	}

	toast.success("Successfully Updated Artist");

	return true;
}
