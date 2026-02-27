"use client";

import { useShallow } from "zustand/react/shallow";
import { useAudioPlayerStore } from "@/lib/audio/useAudioPlayerStore";
import { formatTime } from "@/lib/utils/time";

export const TimeDisplay = () => {
	const { currentTime, duration } = useAudioPlayerStore(
		useShallow((s) => ({
			currentTime: s.currentTime,
			duration: s.duration,
		})),
	);

	return (
		<div className="flex flex-row gap-2 justify-between items-center tabular-nums">
			<time className="text-sm font-medium text-foreground min-w-10">
				{formatTime(currentTime)}
			</time>

			<time className="text-sm font-medium text-muted-foreground min-w-10 text-right">
				{formatTime(duration)}
			</time>
		</div>
	);
};
