"use client";

import { User } from "lucide-react";
import { FormInputField } from "@/components/form/fields/FormInputField";
import { FormTextareaField } from "@/components/form/fields/FormTextareaField";
import { FieldSet } from "@/components/ui/Field";
import {
	type UseArtistFormOptions,
	useArtistForm,
} from "@/features/admin/artist/hooks/useArtistForm";
import { AdminFormLayout } from "@/features/admin/components/AdminFormLayout";

interface ArtistFormProps {
	options: UseArtistFormOptions;
}

export function ArtistForm({ options }: ArtistFormProps) {
	const { form, isSubmitting } = useArtistForm(options);

	const isEdit = options.mode === "edit";

	return (
		<AdminFormLayout
			title={isEdit ? "Edit Artist" : "Add New Artist"}
			description={
				isEdit
					? "Update Artist Details"
					: "Add a new artist and provide a short biography."
			}
			isSubmitting={isSubmitting}
			onSubmit={form.handleSubmit}
			onReset={form.reset}
			submitMessage={isEdit ? "Update Artist" : "Create Artist"}
			submittingMessage={isEdit ? "Updating..." : "Creating..."}
		>
			{/* Artist Info */}
			<FieldSet className="flex flex-col gap-6">
				<div>
					<h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
						Artist Details
					</h3>
				</div>

				<form.Field name="name">
					{(field) => (
						<FormInputField
							field={field}
							label="Name"
							placeholder="Artist Name"
							icon={
								<User className="size-4 text-muted-foreground" />
							}
						/>
					)}
				</form.Field>

				<form.Field name="bio">
					{(field) => (
						<FormTextareaField
							field={field}
							label="Bio"
							placeholder="Artist Bio (optional)"
							maxLength={300}
						/>
					)}
				</form.Field>
			</FieldSet>
		</AdminFormLayout>
	);
}
