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
		<Field className="mt-6">
			<Button type="submit" size="lg" disabled={isSubmitting}>
				{isSubmitting && <Spinner className="size-5" />}
				{isSubmitting ? "Signing In..." : "Sign In"}
			</Button>

			<Button
				variant="outline"
				type="reset"
				disabled={isSubmitting}
				onClick={onReset}
			>
				Reset
			</Button>
		</Field>
	);
}
