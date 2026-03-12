import { AlertCircle, Trash2 } from "lucide-react";
import { useTransition } from "react";
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

interface DeleteButtonProps {
	id: string;
	title: string;
	entityName?: string;
	onDelete?: (id: string) => Promise<void>;
}

export const AdminDeleteButton = ({
	id,
	title,
	entityName = "Item",
	onDelete,
}: DeleteButtonProps) => {
	const [isDeleting, startDelete] = useTransition();

	const handleDelete = () => {
		if (!onDelete) return;

		startDelete(() => onDelete(id));
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger
				render={
					<Button
						variant="ghost"
						size="icon"
						className="size-8 text-muted-foreground hover:bg-destructive/25 hover:text-destructive"
						aria-label={`Delete ${entityName} ${title}`}
					>
						<Trash2 className="size-5" />
					</Button>
				}
			/>

			<AlertDialogContent className="max-w-96">
				<AlertDialogHeader>
					<div className="flex items-center gap-2 text-destructive">
						<AlertCircle className="size-5" />
						<AlertDialogTitle>
							Delete {entityName}
						</AlertDialogTitle>
					</div>

					<AlertDialogDescription>
						This will permanently delete{" "}
						<span className="font-medium text-foreground">
							"{title}"
						</span>
						. This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter className="mt-4">
					<AlertDialogCancel disabled={isDeleting}>
						Cancel
					</AlertDialogCancel>

					<AlertDialogAction
						onClick={handleDelete}
						disabled={isDeleting}
						className="bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-2"
					>
						{isDeleting ? (
							<Spinner className="size-4" />
						) : (
							<Trash2 className="size-4" />
						)}
						{isDeleting
							? `Deleting...`
							: `Delete ${entityName}`}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
