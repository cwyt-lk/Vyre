"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
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
import { createRepositories } from "@/lib/factories/client";

export const SignOutButton = () => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { auth } = createRepositories();

	const signOut = useCallback(async () => {
		setLoading(true);

		const { error } = await auth.signOut();

		if (error) {
			toast.error(error.message);

			setLoading(false);
		} else {
			router.replace("/auth/sign-in");
		}
	}, [router, auth]);

	return (
		<AlertDialog>
			<AlertDialogTrigger
				render={<Button variant="outline">Sign Out</Button>}
			/>
			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogTitle>Sign Out?</AlertDialogTitle>
					<AlertDialogDescription>
						You will need to log back in to access Vyre.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={loading}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={signOut}
						disabled={loading}
						className="flex items-center justify-center gap-2"
					>
						{loading ? (
							<>
								<Spinner />
								<span>Signing Out...</span>
							</>
						) : (
							"Sign Out"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
