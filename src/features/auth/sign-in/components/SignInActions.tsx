import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";

interface SignInActionProps {
	isSubmitting: boolean;
	onReset: () => void;
}

export function SignInActions({
	isSubmitting,
	onReset,
}: SignInActionProps) {
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
						Signing In...
					</>
				) : (
					"Sign In"
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
