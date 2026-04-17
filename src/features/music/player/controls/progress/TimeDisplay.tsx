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
		<div className="flex flex-row justify-between items-center tabular-nums px-0.5">
			<time className="text-sm font-semibold text-foreground min-w-10 tracking-tight">
				{formatTime(currentTime)}
			</time>

			<time className="text-sm font-medium text-muted-foreground min-w-10 text-right tracking-tight">
				{formatTime(duration)}
			</time>
		</div>
	);
};
