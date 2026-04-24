"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { signOutAction } from "@/features/auth/sign-out/actions";

export const SignOutButton = () => {
	const router = useRouter();

	const { execute, isExecuting } = useAction(signOutAction, {
		onSuccess: ({ data }) => {
			if (!data?.success) {
				toast.error(data?.error);
				return;
			}

			console.log("test");

			router.replace("/auth/sign-in");
		},

		onError: () => {
			toast.error("Something went wrong while signing out.");
		},
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger
				render={
					<Button variant="outline">
						<LogOut className="size-4" />
						Sign Out
					</Button>
				}
			/>

			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogTitle>Sign Out?</AlertDialogTitle>

					<AlertDialogDescription>
						You will need to log back in to access Vyre.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel disabled={isExecuting}>
						Cancel
					</AlertDialogCancel>

					<AlertDialogAction
						onClick={() => execute()}
						disabled={isExecuting}
						className="flex items-center justify-center gap-2"
					>
						{isExecuting ? (
							<>
								<Spinner />
								Signing Out...
							</>
						) : (
							<>
								<LogOut className="size-4" />
								Sign Out
							</>
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
