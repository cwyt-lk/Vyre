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
import type { TrackAggregate } from "@/types/domain";

interface AlbumTrackListProps {
	tracks: TrackAggregate[];
}

export const AlbumTrackList = ({ tracks }: AlbumTrackListProps) => {
	const { queue, currentIndex, playByIndex } = useAudioPlayerStore(
		useShallow((s) => ({
			queue: s.queue,
			currentIndex: s.currentIndex,
			playByIndex: s.playByIndex,
		})),
	);

	const currentTrack = queue[currentIndex];

	return (
		<ItemGroup>
			{tracks.map((track, index) => {
				const isSelected = track.id === currentTrack?.id;

				return (
					<Item
						key={track.id}
						variant="card"
						size="xs"
						onClick={() => {
							playByIndex(index);
						}}
						className={cn(
							"transition duration-300 ease-out",
							"cursor-pointer hover:bg-muted",
							isSelected && "ring-2 ring-primary",
						)}
					>
						<ItemMedia className="py-1.5 px-3 text-base text-muted-foreground">
							{index + 1}
						</ItemMedia>
						<ItemContent>
							<ItemTitle className="text-base font-medium truncate">
								{track.title}
							</ItemTitle>

							<ItemDescription className="truncate">
								{track.artists
									.map((a) => a.name)
									.join(", ")}
							</ItemDescription>
						</ItemContent>
					</Item>
				);
			})}
		</ItemGroup>
	);
};
