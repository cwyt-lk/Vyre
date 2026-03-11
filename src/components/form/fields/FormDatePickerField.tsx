"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import { CalendarIcon } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { Calendar } from "@/components/ui/Calendar";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/Field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/InputGroup";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/Popover";
import { formatDate, parseDate } from "@/lib/utils/time";

// --- Component ---

export interface FormDatePickerFieldProps {
	field: AnyFieldApi;
	label?: ReactNode;
	description?: ReactNode;
	placeholder?: string;
}

export const FormDatePickerField = ({
	field,
	label,
	description,
	placeholder = "e.g. June 01, 2025",
}: FormDatePickerFieldProps) => {
	const [open, setOpen] = useState(false);
	const [inputValue, setInputValue] = useState(() =>
		formatDate(field.state.value),
	);

	const { isTouched, errors } = field.state.meta;
	const isInvalid = isTouched && !!errors.length;

	useEffect(() => {
		setInputValue(formatDate(field.state.value));
	}, [field.state.value]);

	const commitValue = (val: string) => {
		const parsed = parseDate(val);

		if (parsed) {
			field.handleChange(parsed);
			setInputValue(formatDate(parsed));
		} else if (val === "") {
			field.handleChange(undefined);
		} else {
			setInputValue(formatDate(field.state.value));
		}
	};

	return (
		<Field data-invalid={isInvalid}>
			{label && (
				<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
			)}

			<InputGroup>
				<InputGroupInput
					id={field.name}
					value={inputValue}
					placeholder={placeholder}
					onChange={(e) => setInputValue(e.target.value)}
					onBlur={() => {
						field.handleBlur();
						commitValue(inputValue);
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") commitValue(inputValue);
						else if (e.key === "ArrowDown") setOpen(true);
					}}
				/>

				<InputGroupAddon align="inline-end">
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger
							render={
								<InputGroupButton
									variant="ghost"
									size="icon-xs"
									type="button"
								>
									<CalendarIcon className="h-4 w-4" />
								</InputGroupButton>
							}
						/>
						<PopoverContent className="w-auto p-0" align="end">
							<Calendar
								mode="single"
								selected={field.state.value}
								onSelect={(date) => {
									field.handleChange(date);
									setOpen(false);
								}}
								defaultMonth={
									field.state.value || new Date()
								}
							/>
						</PopoverContent>
					</Popover>
				</InputGroupAddon>
			</InputGroup>

			{description && (
				<FieldDescription>{description}</FieldDescription>
			)}
			{isInvalid && <FieldError errors={errors} />}
		</Field>
	);
};
