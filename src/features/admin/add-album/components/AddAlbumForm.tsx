"use client";

import { Edit } from "lucide-react";
import {
	FormDatePickerField,
	FormFileUploadField,
	FormInputField,
} from "@/components/form/fields";
import { FormTextareaField } from "@/components/form/fields/FormTextareaField";
import { FieldSet } from "@/components/ui/Field";
import { Separator } from "@/components/ui/Separator";
import { AddAlbumTracksField } from "@/features/admin/add-album/components/AddAlbumTracksField";
import { useAddAlbumForm } from "@/features/admin/add-album/hooks/useAddAlbumForm";
import { MAX_IMAGE_SIZE } from "@/features/admin/add-album/schema";
import { AdminFormLayout } from "@/features/admin/components/AdminFormLayout";
import { getHumanSize } from "@/lib/utils/file";
import type { Track } from "@/types/domain";

interface AddAlbumFormProps {
	tracks: Track[];
}

export function AddAlbumForm({ tracks }: AddAlbumFormProps) {
	const { form, isSubmitting } = useAddAlbumForm();

	return (
		<AdminFormLayout
			title="Add New Album"
			description="Create a new album and assign tracks."
			isSubmitting={isSubmitting}
			onSubmit={form.handleSubmit}
			onReset={form.reset}
			submitMessage="Create Album"
			submittingMessage="Creating..."
		>
			<FieldSet className="space-y-4">
				<div className="space-y-1">
					<h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
						Album Information
					</h3>
				</div>

				<form.Field name="title">
					{(field) => (
						<FormInputField
							field={field}
							label="Album Title"
							placeholder="Enter album title"
							icon={<Edit className="size-4 opacity-70" />}
						/>
					)}
				</form.Field>

				<form.Field name="releaseDate">
					{(field) => (
						<FormDatePickerField
							field={field}
							label="Release Date"
							placeholder="Select a date"
						/>
					)}
				</form.Field>

				<form.Field name="description">
					{(field) => (
						<FormTextareaField
							field={field}
							label="Description"
							placeholder="Brief description (optional)"
							maxLength={300}
						/>
					)}
				</form.Field>
			</FieldSet>

			<Separator />

			{/* Tracks */}
			<FieldSet className="space-y-4">
				<div>
					<h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
						Tracks
					</h3>
				</div>

				<form.Field name="trackIds">
					{(field) => (
						<AddAlbumTracksField
							tracks={tracks}
							value={field.state.value ?? []}
							onChange={field.handleChange}
						/>
					)}
				</form.Field>
			</FieldSet>

			<Separator />

			{/* Cover Image */}
			<FieldSet className="space-y-4">
				<div>
					<h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
						Cover Image
					</h3>
				</div>

				<form.Field name="coverFile">
					{(field) => (
						<FormFileUploadField
							field={field}
							label="Album Artwork"
							description={`Max size: ${getHumanSize(MAX_IMAGE_SIZE)}`}
							accept={{ "image/*": [] }}
						/>
					)}
				</form.Field>
			</FieldSet>
		</AdminFormLayout>
	);
}
