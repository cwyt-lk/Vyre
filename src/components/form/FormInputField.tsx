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
	InputGroupInput,
} from "@/components/ui/InputGroup";

export type FormInputFieldProps = {
	field: AnyFieldApi;
	label?: ReactNode;
	icon?: ReactNode;

	type?: string;
	placeholder?: string;
	description?: ReactNode;
};

export const FormInputField = ({
	field,
	label,
	icon,
	type = "text",
	placeholder,
	description,
}: FormInputFieldProps) => {
	const { isTouched, isValid, errors } = field.state.meta;
	const isInvalid = isTouched && !isValid;

	const descriptionId = description
		? `${field.name}-description`
		: undefined;

	const errorId = isInvalid ? `${field.name}-error` : undefined;

	return (
		<Field data-invalid={isInvalid}>
			{label && (
				<FieldLabel
					htmlFor={field.name}
					aria-invalid={isInvalid}
				>
					{label}
				</FieldLabel>
			)}

			<InputGroup>
				<InputGroupInput
					id={field.name}
					name={field.name}
					value={field.state.value}
					onBlur={field.handleBlur}
					onChange={(e) =>
						field.handleChange(e.target.value)
					}
					type={type}
					placeholder={placeholder}
					aria-invalid={isInvalid}
					aria-describedby={
						[descriptionId, errorId]
							.filter(Boolean)
							.join(" ") || undefined
					}
				/>
				<InputGroupAddon>{icon}</InputGroupAddon>
			</InputGroup>

			{description && (
				<FieldDescription id={descriptionId} className="px-2">
					{description}
				</FieldDescription>
			)}

			{isInvalid && (
				<FieldError errors={errors} className="px-2" />
			)}
		</Field>
	);
};

export default FormInputField;
