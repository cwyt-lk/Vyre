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
import { addTrack } from "@/features/admin/add-track/action";
import type {
	AddTrackClientInput,
	AddTrackServerInput,
} from "@/features/admin/add-track/schema";
import { createRepositories } from "@/lib/factories/repository/client";
import { getHashedPath } from "@/lib/utils/hash";

export function useAddAlbumForm() {
	const form = useForm({
		defaultValues: addAlbumClientDefaultValues,
		validators: {
			onSubmit: addAlbumClientSchema,
		},
		onSubmit: async ({ value }) => {
			const { storage } = createRepositories();

			const clientData = value as AddAlbumClientInput;
			const { coverFile, ...otherClientData } = clientData;

			const hashedPath = await getHashedPath(coverFile);

			const uploadRes = await storage.uploadFile(
				coverFile,
				"cover-art",
				hashedPath,
			);

			if (!uploadRes.success) {
				toast.error("Failed to upload file");
			} else {
				const serverData: AddAlbumServerInput = {
					...otherClientData,
					coverPath: uploadRes.data,
				};

				const addAlbumRes = await addAlbum(serverData);

				if (!addAlbumRes.success) {
					toast.error(addAlbumRes.error);
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
