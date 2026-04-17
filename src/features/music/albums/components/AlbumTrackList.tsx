"use client";

import { Play } from "lucide-react";
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
	const { queue, currentIndex, playByIndex, isPlaying } =
		useAudioPlayerStore(
			useShallow((s) => ({
				queue: s.queue,
				currentIndex: s.currentIndex,
				playByIndex: s.playByIndex,
				isPlaying: s.isPlaying,
			})),
		);

	const currentTrack = queue[currentIndex];

	return (
		<ItemGroup className="flex flex-col gap-2">
			{tracks.map(({ id, title, artists }, index) => {
				const artistNames = artists.map((a) => a.name).join(", ");
				const isSelected = id === currentTrack?.id;
				const isCurrentPlaying = isSelected && isPlaying;

				return (
					<Item
						key={id}
						variant="card"
						size="xs"
						onClick={() => playByIndex(index)}
						className={cn(
							"group cursor-pointer transition-all duration-200 ease-out hover:bg-accent/50",
							isSelected &&
								"bg-primary/10 ring-1 ring-primary hover:bg-primary/15",
							isCurrentPlaying &&
								"ring-2 ring-primary shadow-md",
						)}
					>
						<ItemMedia className="flex min-w-8 items-center justify-center px-3 py-2 transition-colors duration-200">
							{isCurrentPlaying ? (
								<div className="flex items-center gap-1">
									<div className="h-4 w-1 animate-pulse rounded-full bg-primary" />
									<div className="h-3 w-1 animate-pulse rounded-full bg-primary delay-300" />
									<div className="h-2 w-1 animate-pulse rounded-full bg-primary delay-500" />
								</div>
							) : (
								<>
									<span className="group-hover:hidden text-sm font-medium text-muted-foreground">
										{String(index + 1).padStart(
											2,
											"0",
										)}
									</span>

									<Play className="hidden size-4 fill-current text-primary group-hover:block" />
								</>
							)}
						</ItemMedia>

						<ItemContent>
							<ItemTitle
								className={cn(
									"text-base font-semibold truncate transition-colors duration-200",
									isSelected
										? "text-primary"
										: "text-foreground group-hover:text-primary",
								)}
							>
								{title}
							</ItemTitle>

							<ItemDescription className="truncate text-sm">
								{artistNames}
							</ItemDescription>
						</ItemContent>

						{isSelected && (
							<div className="flex items-center justify-center pr-2">
								<div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
							</div>
						)}
					</Item>
				);
			})}
		</ItemGroup>
	);
};
