"use client";

import { useShallow } from "zustand/react/shallow";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/Item";
import { useAudioPlayerStore } from "@/lib/audio/useAudioPlayerStore";
import { cn } from "@/lib/utils/cn";
import type { Track } from "@/types/domain/track";

interface TrackListProps {
	tracks: Track[];
}

export const TrackList = ({ tracks }: TrackListProps) => {
	const { queue, currentIndex, playByIndex } = useAudioPlayerStore(
		useShallow((s) => ({
			queue: s.queue,
			currentIndex: s.currentIndex,
			playByIndex: s.playByIndex,
		})),
	);

	const currentTrack = queue[currentIndex ?? 0];

	return (
		<ItemGroup>
			{tracks.map((track, index) => {
				const isSelected = track === currentTrack;

				return (
					<Item
						key={track.id}
						variant="muted"
						size="sm"
						onClick={() => {
							playByIndex(index);
						}}
						className={cn(
							"transition duration-500 cursor-pointer",
							"hover:bg-muted",
							isSelected && "ring-2 ring-primary",
						)}
					>
						<ItemMedia className="text-sm text-muted-foreground">
							{index + 1}
						</ItemMedia>
						<ItemContent>
							<ItemTitle className="text-base font-semibold">
								{track.title}
							</ItemTitle>

							<ItemDescription>
								{track.artists.join(", ")}
							</ItemDescription>
						</ItemContent>
					</Item>
				);
			})}
		</ItemGroup>
	);
};
