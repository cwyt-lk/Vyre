"use client";

import { SkipBack, SkipForward } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/Button";
import { useAudioPlayerStore } from "@/lib/audio/useAudioPlayerStore";

interface SkipButtonProps {
	reverse?: boolean;
	disabled?: boolean;
}

export const SkipNextButton = ({
	reverse = false,
	disabled = false,
}: SkipButtonProps) => {
	const { playPrevious, playNext, isLoading } = useAudioPlayerStore(
		useShallow((s) => ({
			playPrevious: s.playPrevious,
			playNext: s.playNext,
			isLoading: s.isLoading,
		})),
	);

	return (
		<Button
			variant="default"
			size="icon"
			onClick={reverse ? playPrevious : playNext}
			disabled={disabled || isLoading}
			aria-label={reverse ? "Play Previous" : "Play Next"}
			className={`
                group
                size-12
                rounded-xl
            `}
		>
			{reverse ? (
				<SkipBack className="size-5" />
			) : (
				<SkipForward className="size-5" />
			)}
		</Button>
	);
};
