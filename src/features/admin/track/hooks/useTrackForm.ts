"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { createTrackAction } from "@/features/admin/track/actions/createTrack";
import {
	type CreateTrackClientInput,
	type CreateTrackServerInput,
	createTrackClientSchema,
	trackClientDefaultValues,
} from "@/features/admin/track/schemas/createSchema";
import { createRepositories } from "@/lib/factories/repository/client";
import type { StorageRepositoryContract } from "@/lib/repositories";
import { getHashedPath } from "@/lib/utils/hash";

/**
 * Hook for the Add Track form
 */
export function useTrackForm() {
	const { storage } = createRepositories();

	const form = useForm({
		defaultValues: trackClientDefaultValues,
		validators: { onSubmit: createTrackClientSchema },
		onSubmit: async ({ value }) => {
			const { audioFile, ...trackData } =
				value as CreateTrackClientInput;

			const uploadResult = await uploadAudio(storage, audioFile);

			if (!uploadResult.success) {
				toast.error("Failed to upload audio file");
				return;
			}

			const serverData: CreateTrackServerInput = {
				...trackData,
				audioPath: uploadResult.path,
			};

			const result = await createTrackAction(serverData);

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
