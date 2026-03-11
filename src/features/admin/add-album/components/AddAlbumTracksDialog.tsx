import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/Command";
import type { Track } from "@/types/domain";

interface AddAlbumTracksDialogProps {
	tracks: Track[];
	selected: string[];
	onAdd: (id: string) => void;
}

export const AddAlbumTracksDialog = ({
	tracks,
	selected,
	onAdd,
}: AddAlbumTracksDialogProps) => {
	const [open, setOpen] = useState(false);

	return (
		<div className="flex flex-col gap-4">
			<Button
				onClick={() => setOpen(true)}
				variant="outline"
				className="w-fit"
			>
				Add Track
			</Button>

			<CommandDialog open={open} onOpenChange={setOpen}>
				<Command>
					<CommandInput placeholder="Type a command or search..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>

						<CommandGroup heading="Tracks">
							{tracks.map((track) => {
								const isSelected = selected.includes(
									track.id,
								);

								return (
									<CommandItem
										key={track.id}
										onSelect={() => onAdd(track.id)}
									>
										{track.title}

										{isSelected && (
											<Check className="ml-auto size-4" />
										)}
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</CommandDialog>
		</div>
	);
};
