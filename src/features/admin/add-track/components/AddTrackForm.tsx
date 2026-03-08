"use client";

import { Edit } from "lucide-react";
import { useMemo } from "react";

import {
	type ComboboxOption,
	FormComboboxField,
	FormFileUploadField,
	FormInputField,
	FormMultiComboboxField,
} from "@/components/form";
import { FieldGroup, FieldSet } from "@/components/ui/Field";
import { Separator } from "@/components/ui/Separator";
import { AddTrackActions } from "@/features/admin/add-track/components/AddTrackActions";
import { AddTrackHeader } from "@/features/admin/add-track/components/AddTrackHeader";
import { useAddTrackForm } from "@/features/admin/add-track/hooks/useAddTrackForm";
import { MAX_AUDIO_SIZE } from "@/features/admin/add-track/schema";
import { getHumanSize } from "@/lib/utils/file";
import type { Artist, Genre } from "@/types/domain";

interface AddTrackFormProps {
	genres: Genre[];
	artists: Artist[];
}

export function AddTrackForm({ genres, artists }: AddTrackFormProps) {
	const { form, isSubmitting } = useAddTrackForm();

	const artistOptions: ComboboxOption[] = useMemo(
		() => artists.map((it) => ({ label: it.name, value: it.id })),
		[artists],
	);

	const genreOptions: ComboboxOption[] = useMemo(
		() => genres.map((it) => ({ label: it.label, value: it.id })),
		[genres],
	);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="w-full"
		>
			<FieldGroup className="p-4">
				<AddTrackHeader />

				<FieldSet className="mt-8 space-y-6">
					{/* Primary Metadata */}
					<form.Field name="title">
						{(field) => (
							<FormInputField
								field={field}
								label="Track Title"
								icon={
									<Edit className="size-4 opacity-70" />
								}
								placeholder="Enter track title"
							/>
						)}
					</form.Field>

					<form.Field name="artistIds">
						{(field) => (
							<FormMultiComboboxField
								field={field}
								options={artistOptions}
								label="Artists"
								placeholder="Select artists"
							/>
						)}
					</form.Field>

					<form.Field name="genreId">
						{(field) => (
							<FormComboboxField
								field={field}
								options={genreOptions}
								label="Genre"
								placeholder="Select a genre (optional)"
							/>
						)}
					</form.Field>

					<Separator />

					{/* Media Upload */}
					<form.Field name="audioFile">
						{(field) => (
							<FormFileUploadField
								field={field}
								label="Audio File"
								description={`Max size: ${getHumanSize(MAX_AUDIO_SIZE)}`}
								accept={{ "audio/*": [] }}
							/>
						)}
					</form.Field>
				</FieldSet>

				<AddTrackActions
					isSubmitting={isSubmitting}
					onReset={() => form.reset()}
				/>
			</FieldGroup>
		</form>
	);
}
