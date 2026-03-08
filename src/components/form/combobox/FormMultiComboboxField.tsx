import type { AnyFieldApi } from "@tanstack/react-form";
import { Fragment, type ReactNode, useCallback, useMemo } from "react";
import type { ComboboxOption } from "@/components/form";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
	useComboboxAnchor,
} from "@/components/ui/Combobox";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/Field";

export interface FormMultiComboboxFieldProps {
	field: AnyFieldApi;
	label?: ReactNode;
	placeholder?: string;
	description?: ReactNode;

	options: ComboboxOption[];
	onChange?: (value: string[] | null) => void;
}

export const FormMultiComboboxField = ({
	field,
	label,
	placeholder,
	description,
	options,
	onChange,
}: FormMultiComboboxFieldProps) => {
	const anchor = useComboboxAnchor();

	const selectedValues: string[] = field.state.value ?? [];

	const { isTouched, errors } = field.state.meta;
	const isInvalid = isTouched && errors.length > 0;

	// Build Map lookups for constant time O(1) retrieval.
	// Memoized O(n) construction to optimize component performance.
	const { labelToValue, valueToLabel, allLabels } = useMemo(() => {
		const l2v = new Map<string, string>(); // Label -> Value
		const v2l = new Map<string, string>(); // Value -> Label

		const labels: string[] = [];

		options.forEach((opt) => {
			l2v.set(opt.label, opt.value);
			v2l.set(opt.value, opt.label);

			labels.push(opt.label);
		});

		return { labelToValue: l2v, valueToLabel: v2l, allLabels: labels };
	}, [options]);

	const selectedLabels = useMemo(
		() =>
			selectedValues
				.map((v) => valueToLabel.get(v))
				.filter(Boolean) as string[],
		[selectedValues, valueToLabel],
	);

	const handleChange = useCallback(
		(labels: string[]) => {
			const nextValues = labels
				.map((l) => labelToValue.get(l))
				.filter(Boolean) as string[];

			if (onChange) {
				onChange(nextValues);
			} else {
				field.handleChange(nextValues);
			}

			field.handleBlur();
		},
		[field, labelToValue, onChange],
	);

	return (
		<Field data-invalid={isInvalid}>
			{label && (
				<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
			)}

			<Combobox
				multiple
				autoHighlight
				value={selectedLabels}
				onValueChange={handleChange}
				items={allLabels}
			>
				<ComboboxChips ref={anchor} className="w-full">
					<ComboboxValue>
						{(values) => (
							<Fragment>
								{values.map((value: string) => (
									<ComboboxChip key={value}>
										{value}
									</ComboboxChip>
								))}

								<ComboboxChipsInput
									placeholder={
										!selectedValues.length
											? placeholder
											: ""
									}
									aria-invalid={isInvalid}
								/>
							</Fragment>
						)}
					</ComboboxValue>
				</ComboboxChips>

				<ComboboxContent anchor={anchor}>
					<ComboboxEmpty>No items found.</ComboboxEmpty>
					<ComboboxList>
						{(item) => (
							<ComboboxItem key={item} value={item}>
								{item}
							</ComboboxItem>
						)}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>

			{description && (
				<FieldDescription className="px-2 mt-1">
					{description}
				</FieldDescription>
			)}

			{isInvalid && (
				<FieldError errors={errors} className="px-2 mt-1" />
			)}
		</Field>
	);
};
