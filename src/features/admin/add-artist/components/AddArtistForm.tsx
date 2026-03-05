"use client";

import { User } from "lucide-react";
import { FormInputField } from "@/components/form/FormInputField";
import { FormTextareaField } from "@/components/form/FormTextareaField";
import { FieldGroup, FieldSet } from "@/components/ui/Field";
import { AddArtistActions } from "@/features/admin/add-artist/components/AddArtistActions";
import { AddArtistHeader } from "@/features/admin/add-artist/components/AddArtistHeader";
import { useAddArtistForm } from "@/features/admin/add-artist/hooks/useAddArtistForm";

export function AddArtistForm() {
	const { form, isSubmitting } = useAddArtistForm();

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="w-full"
		>
			<FieldGroup className="p-4">
				<AddArtistHeader />

				<FieldSet className="mt-8 space-y-4">
					<form.Field name="name">
						{(field) => (
							<FormInputField
								field={field}
								label="Name"
								icon={
									<User className="size-4 text-muted-foreground" />
								}
								placeholder="Name"
								type="text"
							/>
						)}
					</form.Field>

					<form.Field name="bio">
						{(field) => (
							<FormTextareaField
								field={field}
								label="Bio"
								placeholder="Artist Bio (optional)..."
								maxLength={300}
							/>
						)}
					</form.Field>
				</FieldSet>

				<AddArtistActions
					isSubmitting={isSubmitting}
					onReset={() => form.reset()}
				/>
			</FieldGroup>
		</form>
	);
}
