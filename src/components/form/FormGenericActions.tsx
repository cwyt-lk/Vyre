import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";

interface FormGenericActionsProps {
	message?: string;
	isSubmittingMsg?: string;
	isSubmitting: boolean;
	resetMessage?: string;
	onReset: () => void;
}

export function FormGenericActions({
	message = "Submit",
	isSubmittingMsg = "Submitting...",
	isSubmitting,
	resetMessage = "Reset",
	onReset,
}: FormGenericActionsProps) {
	return (
		<Field className="mt-8 flex flex-col gap-3">
			<Button
				type="submit"
				size="lg"
				className="w-full font-semibold transition-all active:scale-[0.98]"
				disabled={isSubmitting}
			>
				{isSubmitting ? (
					<>
						<Spinner className="mr-2" />
						{isSubmittingMsg}
					</>
				) : (
					message
				)}
			</Button>

			<Button
				variant="ghost"
				type="button"
				size="sm"
				className="text-muted-foreground hover:text-foreground h-9"
				disabled={isSubmitting}
				onClick={(e) => {
					e.preventDefault();
					onReset();
				}}
			>
				{resetMessage}
			</Button>
		</Field>
	);
}
