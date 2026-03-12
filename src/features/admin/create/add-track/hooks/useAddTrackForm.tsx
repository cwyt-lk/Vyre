"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { addTrack } from "@/features/admin/create/add-track/action";
import {
	addTrackClientDefaultValues,
	type AddTrackClientInput,
	addTrackClientSchema,
	type AddTrackServerInput,
} from "@/features/admin/create/add-track/schema";
import { createRepositories } from "@/lib/factories/repository/client";
import type { StorageRepositoryContract } from "@/lib/repositories";
import { getHashedPath } from "@/lib/utils/hash";

/**
 * Hook for the Add Track form
 */
export function useAddTrackForm() {
	const { storage } = createRepositories();

	const form = useForm({
		defaultValues: addTrackClientDefaultValues,
		validators: { onSubmit: addTrackClientSchema },
		onSubmit: async ({ value }) => {
			const { audioFile, ...trackData } =
				value as AddTrackClientInput;

			const uploadResult = await uploadAudio(storage, audioFile);

			if (!uploadResult.success) {
				toast.error("Failed to upload audio file");
				return;
			}

			const serverData: AddTrackServerInput = {
				...trackData,
				audioPath: uploadResult.path,
			};

			const result = await addTrack(serverData);

			if (!result.success) {
				toast.error(result.error);
				return;
			}

			form.reset();
			toast.success(`Created track: ${serverData.title}`);
		},
	});

	const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

	return { form, isSubmitting };
}

/**
 * Upload audio file to storage
 */
async function uploadAudio(
	storage: StorageRepositoryContract,
	file: File,
) {
	const hashedPath = await getHashedPath(file);
	const result = await storage.uploadFile(file, "music", hashedPath);

	if (!result.success) return { success: false as const };

	return { success: true as const, path: result.data };
}
