"use client";

import { Edit, Key } from "lucide-react";
import { FormInputField } from "@/components/form/fields/FormInputField";
import { FieldSet } from "@/components/ui/Field";
import { AdminFormLayout } from "@/features/admin/components/AdminFormLayout";
import { useAddGenreForm } from "@/features/admin/create/add-genre/hooks/useAddGenreForm";
import { slugify } from "@/lib/utils/string";

export function AddGenreForm() {
	const { form, isSubmitting } = useAddGenreForm();

	return (
		<AdminFormLayout
			title="Add New Genre"
			description="Create a new genre and assign a unique key for URLs."
			isSubmitting={isSubmitting}
			onSubmit={form.handleSubmit}
			onReset={form.reset}
			submitMessage="Create Genre"
			submittingMessage="Creating..."
		>
			{/* Genre Info */}
			<FieldSet className="space-y-6">
				<div>
					<h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
						Genre Details
					</h3>
				</div>

				<form.Field name="label">
					{(field) => (
						<FormInputField
							field={field}
							label="Label"
							placeholder="Genre name"
							icon={
								<Edit className="size-4 text-muted-foreground" />
							}
							onChange={(value) => {
								field.handleChange(value);
								form.setFieldValue("key", slugify(value));
							}}
						/>
					)}
				</form.Field>

				<form.Field name="key">
					{(field) => (
						<FormInputField
							field={field}
							label="Key"
							placeholder="Slug / key"
							icon={
								<Key className="size-4 text-muted-foreground" />
							}
							description="Used for URLs and database lookups."
						/>
					)}
				</form.Field>
			</FieldSet>
		</AdminFormLayout>
	);
}
