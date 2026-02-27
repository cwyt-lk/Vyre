"use client";

import { Pause, Play } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useAudioPlayerStore } from "@/lib/audio/useAudioPlayerStore";

interface PlaybackButtonProps {
	disabled?: boolean;
}

export const PlayPauseButton = ({
	disabled = false,
}: PlaybackButtonProps) => {
	const { togglePlay, isPlaying, isLoading } = useAudioPlayerStore(
		useShallow((s) => ({
			togglePlay: s.togglePlay,
			isPlaying: s.isPlaying,
			isLoading: s.isLoading,
		})),
	);

	return (
		<Button
			variant="default"
			size="icon-lg"
			onClick={togglePlay}
			disabled={disabled || isLoading}
			aria-label={isPlaying ? "Pause audio" : "Play audio"}
			className={`
                group
                size-16
                rounded-2xl
            `}
		>
			{isLoading ? (
				<Spinner className="size-6" />
			) : isPlaying ? (
				<Pause className="size-6" />
			) : (
				<Play className="size-6 translate-x-px" />
			)}
		</Button>
	);
};
