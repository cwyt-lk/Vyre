"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { createRepositories } from "@/lib/factories/repository/client";
import type { StorageRepositoryContract } from "@/lib/repositories";
import { getHashedPath } from "@/lib/utils/hash";
import { createTrackAction } from "../actions/createTrack";
import { updateTrackAction } from "../actions/updateTrack";
import {
	type CreateTrackClientInput,
	type CreateTrackServerInput,
	createTrackClientSchema,
	trackClientDefaultValues,
} from "../schemas/createSchema";
import {
	type UpdateTrackClientInput,
	type UpdateTrackServerInput,
	updateTrackClientSchema,
} from "../schemas/updateSchema";

export type UseTrackFormOptions =
	| {
			mode: "create";
	  }
	| {
			mode: "edit";
			initialData: UpdateTrackClientInput;
	  };

export function useTrackForm(options: UseTrackFormOptions) {
	const { storage } = createRepositories();

	const defaultValues =
		options.mode === "create"
			? trackClientDefaultValues
			: {
					...trackClientDefaultValues,
					...options.initialData,
				};

	const schema =
		options.mode === "create"
			? createTrackClientSchema
			: updateTrackClientSchema;

	const form = useForm({
		defaultValues: defaultValues,
		validators: {
			onSubmit: schema,
		},

		onSubmit: async ({ value }) => {
			if (options.mode === "create") {
				const success = await handleCreate(
					value as CreateTrackClientInput,
					storage,
				);

				if (success) form.reset();
			} else {
				await handleUpdate(
					value as UpdateTrackClientInput,
					storage,
				);
			}
		},
	});

	const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

	return { form, isSubmitting };
}

async function handleCreate(
	value: CreateTrackClientInput,
	storage: StorageRepositoryContract,
) {
	const { audioFile, ...trackData } = value;

	const uploadResult = await uploadAudio(storage, audioFile);

	if (!uploadResult.success) {
		toast.error("Failed to upload audio file");

		return false;
	}

	const serverInput: CreateTrackServerInput = {
		...trackData,
		audioPath: uploadResult.path,
	};

	const result = await createTrackAction(serverInput);

	if (!result.success) {
		toast.error(result.error);

		return false;
	}

	toast.success(`Created track: ${serverInput.title}`);

	return true;
}

async function handleUpdate(
	value: UpdateTrackClientInput,
	storage: StorageRepositoryContract,
) {
	const { audioFile, ...trackData } = value;

	let audioPath: string | undefined;

	if (audioFile) {
		const uploadResult = await uploadAudio(storage, audioFile);

		if (!uploadResult.success) {
			toast.error("Failed to upload audio file");

			return false;
		}

		audioPath = uploadResult.path;
	}

	const serverInput: UpdateTrackServerInput = {
		...trackData,
		audioPath: audioPath,
	};

	const result = await updateTrackAction(serverInput);

	if (!result.success) {
		toast.error(result.error);

		return false;
	}

	toast.success(`Updated track: ${serverInput.title}`);

	return true;
}

async function uploadAudio(
	storage: StorageRepositoryContract,
	file: File,
) {
	const hashedPath = await getHashedPath(file);
	const result = await storage.uploadFile(file, "music", hashedPath);

	if (!result.success) {
		return { success: false as const };
	}

	return {
		success: true as const,
		path: result.data,
	};
}
