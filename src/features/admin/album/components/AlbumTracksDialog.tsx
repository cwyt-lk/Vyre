"use client";

import { Check, Music, Plus } from "lucide-react";
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

interface AlbumTracksDialogProps {
	tracks: Track[];
	selected: string[];
	onAdd: (id: string) => void;
}

export function AlbumTracksDialog({
	tracks,
	selected,
	onAdd,
}: AlbumTracksDialogProps) {
	const [open, setOpen] = useState(false);

	function handleSelect(trackId: string) {
		if (!selected.includes(trackId)) {
			onAdd(trackId);
		}
	}

	return (
		<>
			<Button
				type="button"
				variant="outline"
				size="sm"
				className="gap-2"
				onClick={() => setOpen(true)}
			>
				<Plus className="size-4" />
				Add Track
			</Button>

			<CommandDialog open={open} onOpenChange={setOpen}>
				<Command>
					<CommandInput placeholder="Search tracks..." />

					<CommandList>
						<CommandEmpty className="py-6 text-sm text-muted-foreground">
							No tracks found
						</CommandEmpty>

						<CommandGroup
							heading={`Tracks (${tracks.length})`}
							className="max-h-80 overflow-auto"
						>
							{tracks.map((track) => {
								const isSelected = selected.includes(
									track.id,
								);

								return (
									<CommandItem
										key={track.id}
										value={track.title}
										onSelect={() =>
											handleSelect(track.id)
										}
										className="flex items-center gap-2"
									>
										<Music className="size-4 opacity-60" />

										<span className="flex-1 truncate">
											{track.title}
										</span>

										{isSelected && (
											<Check className="size-4 text-primary" />
										)}
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</CommandDialog>
		</>
	);
}
