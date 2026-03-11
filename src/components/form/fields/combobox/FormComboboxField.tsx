import type { AnyFieldApi } from "@tanstack/react-form";
import { type ReactNode, useCallback, useMemo } from "react";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/Combobox";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/Field";

export interface ComboboxOption {
	label: string;
	value: string;
}

export interface FormComboboxFieldProps {
	field: AnyFieldApi;
	label?: ReactNode;
	placeholder?: string;
	description?: ReactNode;

	options: ComboboxOption[];
	onChange?: (value: string | null) => void;
}

export const FormComboboxField = ({
	field,
	label,
	placeholder,
	description,
	options,
	onChange,
}: FormComboboxFieldProps) => {
	const { isTouched, isValid, errors } = field.state.meta;
	const isInvalid = isTouched && !isValid;

	const handleChange = useCallback(
		(value: string | null) => {
			const selected = options.find((it) => it.label === value);

			if (onChange) {
				onChange(selected?.value ?? "");
			} else {
				field.handleChange(selected?.value ?? "");
			}

			field.handleBlur();
		},
		[field, onChange, options],
	);

	const selectedLabel = useMemo(
		() =>
			options.find((opt) => opt.value === field.state.value)
				?.label ?? "",

		[field.state.value, options],
	);

	const itemLabels = useMemo(
		() => options.map((it) => it.label),
		[options],
	);

	return (
		<Field data-invalid={isInvalid}>
			{label && (
				<FieldLabel htmlFor={field.name} aria-invalid={isInvalid}>
					{label}
				</FieldLabel>
			)}

			<Combobox
				autoHighlight
				items={itemLabels}
				value={selectedLabel}
				onValueChange={handleChange}
			>
				<ComboboxInput
					id={field.name}
					placeholder={placeholder}
					aria-invalid={isInvalid}
				/>

				<ComboboxContent>
					<ComboboxEmpty>No items found.</ComboboxEmpty>

					<ComboboxList>
						{(label) => (
							<ComboboxItem key={label} value={label}>
								{label}
							</ComboboxItem>
						)}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>

			{description && (
				<FieldDescription className="px-2">
					{description}
				</FieldDescription>
			)}

			{isInvalid && <FieldError errors={errors} className="px-2" />}
		</Field>
	);
};
