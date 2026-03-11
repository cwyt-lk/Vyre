import { FieldDescription, FieldLegend } from "@/components/ui/Field";

export function AddAlbumHeader() {
	return (
		<div className="flex flex-col items-center space-y-2 text-center">
			<FieldLegend className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
				Create New Album
			</FieldLegend>

			<FieldDescription className="text-sm text-muted-foreground"></FieldDescription>
		</div>
	);
}
