import { Loader2 } from "lucide-react"; // Standard shadcn/lucide spinner
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";

interface SignUpActionProps {
	isSubmitting: boolean;
	onReset: () => void;
}

export function SignUpActions({
	isSubmitting,
	onReset,
}: SignUpActionProps) {
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
						Creating Account...
					</>
				) : (
					"Create Account"
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
				Reset
			</Button>
		</Field>
	);
}
