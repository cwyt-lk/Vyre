"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { addTrack } from "@/features/admin/add-track/action";
import {
	type AddTrackClientInput,
	type AddTrackServerInput,
	addTrackClientDefaultValues,
	addTrackClientSchema,
} from "@/features/admin/add-track/schema";
import { createRepositories } from "@/lib/factories/repository/client";
import { getHashedPath } from "@/lib/utils/hash";

export function useAddTrackForm() {
	const form = useForm({
		defaultValues: addTrackClientDefaultValues,
		validators: {
			onSubmit: addTrackClientSchema,
		},
		onSubmit: async ({ value }) => {
			const { storage } = createRepositories();

			const clientData = value as AddTrackClientInput;
			const file = clientData.audioFile;

			const hashedPath = await getHashedPath(file);

			const uploadRes = await storage.uploadFile(
				file,
				"music",
				hashedPath,
			);

			if (!uploadRes.success) {
				toast.error("Failed to upload file");

				console.log(uploadRes.error);
			} else {
				const serverData: AddTrackServerInput = {
					title: clientData.title,
					artistIds: clientData.artistIds,
					genreId: clientData.genreId,
					audioPath: uploadRes.data,
				};

				const addTrackRes = await addTrack(serverData);

				if (!addTrackRes.success) {
					toast.error(addTrackRes.error);
				} else {
					form.reset();

					toast.success(`Created Track: ${serverData.title}`);
				}
			}
		},
	});

	const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

	return { form, isSubmitting };
}
