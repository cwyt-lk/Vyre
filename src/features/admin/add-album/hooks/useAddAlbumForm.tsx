"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { addAlbum } from "@/features/admin/add-album/action";
import {
	type AddAlbumClientInput,
	type AddAlbumServerInput,
	addAlbumClientDefaultValues,
	addAlbumClientSchema,
} from "@/features/admin/add-album/schema";
import { createRepositories } from "@/lib/factories/repository/client";
import type { StorageRepositoryContract } from "@/lib/repositories";
import { getHashedPath } from "@/lib/utils/hash";

export function useAddAlbumForm() {
	const { storage } = createRepositories();

	const form = useForm({
		defaultValues: addAlbumClientDefaultValues,
		validators: {
			onSubmit: addAlbumClientSchema,
		},
		onSubmit: async ({ value }) => {
			const { coverFile, ...albumData } =
				value as AddAlbumClientInput;

			const uploadResult = await uploadCover(storage, coverFile);

			if (!uploadResult.success) {
				toast.error("Failed to upload cover image");

				return;
			}

			const serverInput: AddAlbumServerInput = {
				...albumData,
				coverPath: uploadResult.path,
			};

			const result = await addAlbum(serverInput);

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
