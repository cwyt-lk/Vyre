import { Spinner } from "@/components/ui/Spinner";

export const LoadingScreen = () => {
	return (
		<div className="fixed inset-0 flex items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<Spinner className="size-16 text-primary" />
				<p className="text-base text-muted-foreground tracking-wide">
					Loading, please wait…
				</p>
			</div>
		</div>
	);
};
