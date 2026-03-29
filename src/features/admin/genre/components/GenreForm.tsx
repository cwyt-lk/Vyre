"use client";

import { Edit, Key } from "lucide-react";
import { FormInputField } from "@/components/form/fields/FormInputField";
import { FieldSet } from "@/components/ui/Field";
import { AdminFormLayout } from "@/features/admin/components/AdminFormLayout";
import {
	type UseGenreFormOptions,
	useGenreForm,
} from "@/features/admin/genre/hooks/useGenreForm";
import { slugify } from "@/lib/utils/string";

interface GenreFormProps {
	options: UseGenreFormOptions;
}

export function GenreForm({ options }: GenreFormProps) {
	const { form, isSubmitting } = useGenreForm(options);

	const isEdit = options.mode === "edit";

	return (
		<AdminFormLayout
			title={isEdit ? "Edit Genre" : "Add New Genre"}
			description={
				isEdit
					? "Update Genre Details"
					: "Create a new genre and assign a unique key for URLs."
			}
			isSubmitting={isSubmitting}
			onSubmit={form.handleSubmit}
			onReset={form.reset}
			submitMessage={isEdit ? "Update Genre" : "Create Genre"}
			submittingMessage={isEdit ? "Updating..." : "Creating..."}
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
