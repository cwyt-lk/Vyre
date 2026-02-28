import { VyreLogo } from "@/components/brand/VyreLogo";
import { FieldDescription, FieldLegend } from "@/components/ui/Field";

export function AddGenreHeader() {
	return (
		<div className="flex flex-col items-center space-y-2 text-center">
			<VyreLogo className="size-12 p-0" />

			<FieldLegend className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
				Create New Genre
			</FieldLegend>

			<FieldDescription className="text-sm text-muted-foreground">
				Genres help categorize content for better discoverability.
			</FieldDescription>
		</div>
	);
}
