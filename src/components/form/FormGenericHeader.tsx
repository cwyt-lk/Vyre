import { FieldDescription, FieldLegend } from "@/components/ui/Field";

interface FormGenericHeaderProps {
	title: string;
	description: string;
}

export function FormGenericHeader({
	title,
	description,
}: FormGenericHeaderProps) {
	return (
		<div className="flex flex-col items-center gap-2 text-center">
			<FieldLegend className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
				{title}
			</FieldLegend>

			<FieldDescription className="text-sm text-muted-foreground">
				{description}
			</FieldDescription>
		</div>
	);
}
