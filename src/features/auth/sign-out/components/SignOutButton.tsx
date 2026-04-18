"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
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
	const [isLoading, startTransition] = useTransition();

	const signOut = async () => {
		startTransition(async () => {
			try {
				const res = await signOutAction();

				if (!res.success) {
					toast.error(res.error);
				} else {
					router.replace("/auth/sign-in");
				}
			} catch (_) {
				toast.error("Something went wrong while signing out.");
			}
		});
	};

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
					<AlertDialogCancel disabled={isLoading}>
						Cancel
					</AlertDialogCancel>

					<AlertDialogAction
						onClick={signOut}
						disabled={isLoading}
						className="flex items-center justify-center gap-2"
					>
						{isLoading ? (
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
