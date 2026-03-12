"use client";

import { Edit } from "lucide-react";
import { useMemo } from "react";
import {
	type ComboboxOption,
	FormComboboxField,
	FormFileUploadField,
	FormInputField,
	FormMultiComboboxField,
} from "@/components/form/fields";
import { FieldSet } from "@/components/ui/Field";
import { Separator } from "@/components/ui/Separator";
import { AdminFormLayout } from "@/features/admin/components/AdminFormLayout";
import { useAddTrackForm } from "@/features/admin/create/add-track/hooks/useAddTrackForm";
import { MAX_AUDIO_SIZE } from "@/features/admin/create/add-track/schema";
import { getHumanSize } from "@/lib/utils/file";
import type { Artist, Genre } from "@/types/domain";

interface AddTrackFormProps {
	genres: Genre[];
	artists: Artist[];
}

export function AddTrackForm({ genres, artists }: AddTrackFormProps) {
	const { form, isSubmitting } = useAddTrackForm();

	const artistOptions: ComboboxOption[] = useMemo(
		() => artists.map((a) => ({ label: a.name, value: a.id })),
		[artists],
	);

	const genreOptions: ComboboxOption[] = useMemo(
		() => genres.map((g) => ({ label: g.label, value: g.id })),
		[genres],
	);

	return (
		<AdminFormLayout
			title="Add New Track"
			description="Upload a new track and assign artists and genre."
			isSubmitting={isSubmitting}
			onSubmit={form.handleSubmit}
			onReset={form.reset}
			submitMessage="Create Track"
			submittingMessage="Uploading..."
		>
			{/* Track Info */}
			<FieldSet className="space-y-4">
				<div>
					<h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
						Track Information
					</h3>
				</div>

				<form.Field name="title">
					{(field) => (
						<FormInputField
							field={field}
							label="Track Title"
							placeholder="Enter track title"
							icon={<Edit className="size-4 opacity-70" />}
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
			</FieldSet>

			<Separator />

			{/* Audio Upload */}
			<FieldSet className="space-y-4">
				<div>
					<h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
						Audio File
					</h3>
				</div>

				<form.Field name="audioFile">
					{(field) => (
						<FormFileUploadField
							field={field}
							label="Upload Audio"
							description={`Max size: ${getHumanSize(MAX_AUDIO_SIZE)}`}
							accept={{ "audio/*": [] }}
						/>
					)}
				</form.Field>
			</FieldSet>
		</AdminFormLayout>
	);
}
