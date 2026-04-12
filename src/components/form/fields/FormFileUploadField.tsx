import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";
import type { DropzoneOptions } from "react-dropzone";
import { Field, FieldError, FieldLabel } from "@/components/ui/Field";
import { FileUpload } from "@/components/ui/FileUpload";

export interface FormFileUploadFieldProps extends DropzoneOptions {
	field: AnyFieldApi;
	label?: ReactNode;
	description?: ReactNode;

	onChange?: (files: File[]) => void;
}

export const FormFileUploadField = ({
	field,
	label,
	description,
	multiple,
	onChange,
	...props
}: FormFileUploadFieldProps) => {
	const { isTouched, isValid, errors } = field.state.meta;
	const isInvalid = isTouched && !isValid;

	return (
		<Field data-invalid={isInvalid}>
			{label && (
				<FieldLabel htmlFor={field.name} aria-invalid={isInvalid}>
					{label}
				</FieldLabel>
			)}

			<FileUpload
				value={field.state.value ? [field.state.value] : []}
				onValueChange={(files) => field.handleChange(files[0])}
				multiple={multiple}
				invalid={isInvalid}
				{...props}
			>
				{
					<p className="text-xs text-muted-foreground tracking-wide">
						{description}
					</p>
				}
			</FileUpload>

			{isInvalid && <FieldError errors={errors} className="px-2" />}
		</Field>
	);
};
