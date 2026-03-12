"use client";

import { User } from "lucide-react";
import { FormInputField } from "@/components/form/fields/FormInputField";
import { FormTextareaField } from "@/components/form/fields/FormTextareaField";
import { FieldSet } from "@/components/ui/Field";
import { AdminFormLayout } from "@/features/admin/components/AdminFormLayout";
import { useAddArtistForm } from "@/features/admin/create/add-artist/hooks/useAddArtistForm";

export function AddArtistForm() {
	const { form, isSubmitting } = useAddArtistForm();

	return (
		<AdminFormLayout
			title="Add New Artist"
			description="Add a new artist and provide a short biography."
			isSubmitting={isSubmitting}
			onSubmit={form.handleSubmit}
			onReset={form.reset}
			submitMessage="Create Artist"
			submittingMessage="Creating..."
		>
			{/* Artist Info */}
			<FieldSet className="space-y-6">
				<div>
					<h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
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
