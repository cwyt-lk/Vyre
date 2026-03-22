"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { createAlbumAction } from "@/features/admin/album/actions/createAlbum";
import {
	albumClientDefaultValues,
	type CreateAlbumClientInput,
	type CreateAlbumServerInput,
	createAlbumClientSchema,
} from "@/features/admin/album/schemas/createSchema";
import { createRepositories } from "@/lib/factories/repository/client";
import type { StorageRepositoryContract } from "@/lib/repositories";
import { getHashedPath } from "@/lib/utils/hash";

export function useAlbumForm() {
	const { storage } = createRepositories();

	const form = useForm({
		defaultValues: albumClientDefaultValues,
		validators: {
			onSubmit: createAlbumClientSchema,
		},
		onSubmit: async ({ value }) => {
			const { coverFile, ...albumData } =
				value as CreateAlbumClientInput;

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

			form.reset();
			toast.success(`Created album: ${serverInput.title}`);
		},
	});

	const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

	return { form, isSubmitting };
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
