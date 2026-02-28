import { VyreLogo } from "@/components/brand/VyreLogo";
import { FieldDescription, FieldLegend } from "@/components/ui/Field";

export function SignInHeader() {
	return (
		<div className="flex flex-col items-center space-y-2 text-center">
			<VyreLogo className="size-12 p-0" />

			<FieldLegend className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
				Sign in to Vyre
			</FieldLegend>

			<FieldDescription className="text-sm text-muted-foreground">
				Enter your details below to access your account
			</FieldDescription>
		</div>
	);
}
