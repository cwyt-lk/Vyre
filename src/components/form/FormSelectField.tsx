import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/Field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";

export interface SelectOption {
	label: string;
	value: string;
}

export interface FormSelectFieldProps {
	field: AnyFieldApi;
	label?: ReactNode;
	placeholder?: string;
	description?: ReactNode;

	onChange?: (value: string) => void;

	options: SelectOption[];
}

export const FormSelectField = ({
	field,
	label,
	placeholder,
	description,
	options,
	onChange,
}: FormSelectFieldProps) => {
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

			<Select
				value={field.state.value?.toString() ?? ""}
				onValueChange={(value) => {
					onChange ? onChange(value) : field.handleChange(value);
				}}
			>
				<SelectTrigger
					id={field.name}
					aria-invalid={isInvalid}
					aria-describedby={
						[descriptionId, errorId]
							.filter(Boolean)
							.join(" ") || undefined
					}
				>
					<SelectValue placeholder={placeholder}>
						{
							options.find(
								(opt) => opt.value === field.state.value,
							)?.label
						}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem
							key={option.value}
							value={option.value}
						>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{description && (
				<FieldDescription id={descriptionId} className="px-2">
					{description}
				</FieldDescription>
			)}

			{isInvalid && <FieldError errors={errors} className="px-2" />}
		</Field>
	);
};
