"use client";

import { Music, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AlbumTracksDialog } from "@/features/admin/album/components";
import type { Track } from "@/types/domain";

interface AlbumTracksFieldProps {
	tracks: Track[];
	value: string[];
	onChange: (ids: string[]) => void;
}

export function AlbumTracksField({
	tracks,
	value,
	onChange,
}: AlbumTracksFieldProps) {
	const selectedTracks = value
		.map((id) => tracks.find((t) => t.id === id))
		.filter(Boolean) as Track[];

	const addTrack = (trackId: string) => {
		if (value.includes(trackId)) return;

		onChange([...value, trackId]);
	};

	const removeTrack = (trackId: string) => {
		onChange(value.filter((id) => id !== trackId));
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<AlbumTracksDialog
					tracks={tracks}
					selected={value}
					onAdd={addTrack}
					onRemove={removeTrack}
				/>
			</div>

			<div className="rounded-lg border bg-muted/20">
				{selectedTracks.length === 0 && (
					<div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
						<Music className="size-6 opacity-60" />
						<p className="text-sm">No tracks added yet</p>
					</div>
				)}

				<div className="divide-y">
					{selectedTracks.map((track, index) => (
						<div
							key={track.id}
							className="flex items-center justify-between px-4 py-2 text-sm"
						>
							<span className="flex items-center gap-2">
								<span className="text-muted-foreground w-5">
									{index + 1}.
								</span>
								{track.title}
							</span>

							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => removeTrack(track.id)}
							>
								<X className="size-4" />
							</Button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
