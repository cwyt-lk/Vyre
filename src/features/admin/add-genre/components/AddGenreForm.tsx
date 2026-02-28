"use client";

import { Edit, Key } from "lucide-react";
import { FormInputField } from "@/components/form/FormInputField";
import { FieldGroup, FieldSet } from "@/components/ui/Field";
import { AddGenreActions } from "@/features/admin/add-genre/components/AddGenreActions";
import { AddGenreHeader } from "@/features/admin/add-genre/components/AddGenreHeader";
import { useAddGenreForm } from "@/features/admin/add-genre/hooks/useAddGenreForm";
import { slugify } from "@/lib/utils/string";

export function AddGenreForm() {
	const { form, isSubmitting } = useAddGenreForm();

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="w-full"
		>
			<FieldGroup className="p-4">
				<AddGenreHeader />

				<FieldSet className="mt-8 space-y-4">
					<form.Field name="label">
						{(field) => (
							<FormInputField
								field={field}
								icon={
									<Edit className="size-4 text-muted-foreground" />
								}
								onChange={(value) => {
									field.handleChange(value);

									const derivedKey = slugify(value);

									form.setFieldValue("key", derivedKey);
								}}
								placeholder="Label"
								type="text"
							/>
						)}
					</form.Field>

					<form.Field name="key">
						{(field) => (
							<FormInputField
								field={field}
								icon={
									<Key className="size-4 text-muted-foreground" />
								}
								placeholder="Key"
								type="text"
								description="Used for URLs and database lookups."
							/>
						)}
					</form.Field>
				</FieldSet>

				<AddGenreActions
					isSubmitting={isSubmitting}
					onReset={() => form.reset()}
				/>
			</FieldGroup>
		</form>
	);
}
