"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { createAlbumAction } from "@/features/admin/album/actions/createAlbum";
import { updateAlbumAction } from "@/features/admin/album/actions/updateAlbum";
import {
	albumClientDefaultValues,
	type CreateAlbumClientInput,
	type CreateAlbumServerInput,
	createAlbumClientSchema,
} from "@/features/admin/album/schemas/createSchema";
import {
	type UpdateAlbumClientInput,
	type UpdateAlbumServerInput,
	updateAlbumClientSchema,
} from "@/features/admin/album/schemas/updateSchema";
import { createRepositories } from "@/lib/factories/repository/client";
import type { StorageRepositoryContract } from "@/lib/repositories";
import { getHashedPath } from "@/lib/utils/hash";

export type UseAlbumFormOptions =
	| {
			mode: "create";
	  }
	| {
			mode: "edit";
			initialData: UpdateAlbumClientInput;
	  };

export function useAlbumForm(options: UseAlbumFormOptions) {
	const { storage } = createRepositories();

	const defaultValues =
		options.mode === "create"
			? albumClientDefaultValues
			: {
					...albumClientDefaultValues,
					...options.initialData,
				};

	const schema =
		options.mode === "create"
			? createAlbumClientSchema
			: updateAlbumClientSchema;

	const form = useForm({
		defaultValues: defaultValues,
		validators: {
			onSubmit: schema,
		},

		onSubmit: async ({ value }) => {
			if (options.mode === "create") {
				await handleCreate(
					value as CreateAlbumClientInput,
					storage,
				);

				form.reset();
			} else {
				await handleUpdate(
					value as UpdateAlbumClientInput,
					storage,
				);
			}
		},
	});

	const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

	return { form, isSubmitting };
}

async function handleCreate(
	value: CreateAlbumClientInput,
	storage: StorageRepositoryContract,
) {
	const { coverFile, ...albumData } = value;

	const uploadResult = await uploadCover(storage, coverFile);

	if (!uploadResult.success) {
		toast.error("Failed to upload cover image");
		return;
	}

	const serverInput: CreateAlbumServerInput = {
		...albumData,
		coverPath: uploadResult.path,
	};

	const result = await createAlbumAction(serverInput);

	if (!result.success) {
		toast.error(result.error);
		return;
	}

	toast.success(`Created album: ${serverInput.title}`);
}

async function handleUpdate(
	value: UpdateAlbumClientInput,
	storage: StorageRepositoryContract,
) {
	const { coverFile, ...albumData } = value;

	let coverPath: string | undefined;

	if (coverFile) {
		const uploadResult = await uploadCover(storage, coverFile);

		if (!uploadResult.success) {
			toast.error("Failed to upload cover image");
			return;
		}

		coverPath = uploadResult.path;
	}

	const serverInput: UpdateAlbumServerInput = {
		...albumData,
		coverPath: coverPath,
	};

	const result = await updateAlbumAction(serverInput);

	if (!result.success) {
		toast.error(result.error);
		return;
	}

	toast.success(`Updated album: ${serverInput.title}`);
}

async function uploadCover(
	storage: StorageRepositoryContract,
	file: File,
) {
	const hashedPath = await getHashedPath(file);
	const result = await storage.uploadFile(file, "cover-art", hashedPath);

	if (!result.success) {
		return { success: false as const };
	}

	return {
		success: true as const,
		path: result.data,
	};
}
