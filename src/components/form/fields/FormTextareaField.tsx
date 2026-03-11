import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/Field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/InputGroup";

export interface FormTextareaFieldProps {
	field: AnyFieldApi;
	label?: ReactNode;
	placeholder?: string;
	description?: ReactNode;
	icon?: ReactNode;

	onBlur?: (value: string) => void;
	onChange?: (value: string) => void;

	rows?: number;
	maxLength?: number;
}

export const FormTextareaField = ({
	field,
	label,
	placeholder,
	description,
	icon,
	onBlur,
	onChange,
	rows = 6,
	maxLength = 100,
}: FormTextareaFieldProps) => {
	const { isTouched, isValid, errors } = field.state.meta;
	const isInvalid = isTouched && !isValid;

	const descriptionId = description
		? `${field.name}-description`
		: undefined;

	const errorId = isInvalid ? `${field.name}-error` : undefined;

	return (
		<Field data-invalid={isInvalid}>
			{label && (
				<FieldLabel htmlFor={field.name} aria-invalid={isInvalid}>
					{label}
				</FieldLabel>
			)}

			<InputGroup>
				{icon && (
					<InputGroupAddon align="block-start">
						{icon}
					</InputGroupAddon>
				)}

				<InputGroupTextarea
					id={field.name}
					name={field.name}
					value={field.state.value}
					onBlur={(e) => {
						onBlur
							? onBlur(e.target.value)
							: field.handleBlur();
					}}
					onChange={(e) => {
						onChange
							? onChange(e.target.value)
							: field.handleChange(e.target.value);
					}}
					placeholder={placeholder}
					rows={rows}
					maxLength={maxLength}
					className="min-h-24 resize-none"
					aria-invalid={isInvalid}
					aria-describedby={
						[descriptionId, errorId]
							.filter(Boolean)
							.join(" ") || undefined
					}
				/>

				<InputGroupAddon align="block-end">
					<InputGroupText className="tabular-nums">
						{field.state.value.length}/{maxLength} characters
					</InputGroupText>
				</InputGroupAddon>
			</InputGroup>

			{description && (
				<FieldDescription id={descriptionId} className="px-2">
					{description}
				</FieldDescription>
			)}

			{isInvalid && <FieldError errors={errors} className="px-2" />}
		</Field>
	);
};
