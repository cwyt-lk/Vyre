import { VyreLogo } from "@/components/brand/VyreLogo";
import { FieldDescription, FieldLegend } from "@/components/ui/Field";

export function SignUpHeader() {
	return (
		<div className="flex flex-col items-center flex flex-col gap-2 text-center">
			<VyreLogo className="size-12 p-0" />

			<FieldLegend className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
				Create an account
			</FieldLegend>

			<FieldDescription className="text-sm text-muted-foreground">
				Enter your information to get started with Vyre
			</FieldDescription>
		</div>
	);
}
