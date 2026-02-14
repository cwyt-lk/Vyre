import { FieldDescription, FieldLegend } from "@/components/ui/Field";

export function SignInHeader() {
	return (
		<div className="flex flex-col items-center">
			<FieldLegend className="text-3xl font-semibold">
				Sign In to Vyre
			</FieldLegend>

			<FieldDescription className="text-muted-foreground">
				Welcome back!
			</FieldDescription>
		</div>
	);
}
