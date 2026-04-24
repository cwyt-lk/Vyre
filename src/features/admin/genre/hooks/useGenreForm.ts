"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { createGenreAction } from "../actions/createGenre";
import { updateGenreAction } from "../actions/updateGenre";
import {
	type CreateGenreInput,
	createGenreSchema,
	genreDefaultValues,
} from "../schemas/createSchema";
import {
	type UpdateGenreInput,
	updateGenreSchema,
} from "../schemas/updateSchema";

export type UseGenreFormOptions =
	| {
			mode: "create";
	  }
	| {
			mode: "edit";
			initialData: UpdateGenreInput;
	  };

export function useGenreForm(options: UseGenreFormOptions) {
	const defaultValues =
		options.mode === "create"
			? genreDefaultValues
			: {
					...genreDefaultValues,
					...options.initialData,
				};

	const schema =
		options.mode === "create" ? createGenreSchema : updateGenreSchema;

	const form = useForm({
		defaultValues: defaultValues,
		validators: {
			onSubmit: schema,
		},

		onSubmit: async ({ value }) => {
			if (options.mode === "create") {
				const success = await handleCreate(
					value as CreateGenreInput,
				);

				if (success) form.reset();
			} else {
				await handleUpdate(value as UpdateGenreInput);
			}
		},
	});

	const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

	return { form, isSubmitting };
}

async function handleCreate(value: CreateGenreInput) {
	const result = await createGenreAction(value);

	if (!result?.data?.success) {
		toast.error(result?.data?.error);

		return false;
	}

	toast.success("Successfully Created Genre");

	return true;
}

async function handleUpdate(value: UpdateGenreInput) {
	const result = await updateGenreAction(value);

	if (!result?.data?.success) {
		toast.error(result?.data?.error);

		return false;
	}

	toast.success("Successfully Updated Genre");

	return true;
}
