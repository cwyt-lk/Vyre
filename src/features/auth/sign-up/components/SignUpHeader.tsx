import { FieldDescription, FieldLegend } from "@/components/ui/Field";

export function SignUpHeader() {
	return (
		<div className="flex flex-col items-center">
			<FieldLegend className="text-3xl font-semibold">
				Sign Up to Vyre
			</FieldLegend>

			<FieldDescription className="text-muted-foreground">
				Create an account to continue.
			</FieldDescription>
		</div>
	);
}
