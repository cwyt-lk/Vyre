"use client";

import { Shuffle } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/Button";
import { useAudioPlayerStore } from "@/lib/audio/useAudioPlayerStore";

interface ShuffleButtonProps {
	disabled?: boolean;
}

export const ShuffleButton = ({ disabled }: ShuffleButtonProps) => {
	const { isShuffling, toggleShuffle } = useAudioPlayerStore(
		useShallow((s) => ({
			isShuffling: s.isShuffling,
			toggleShuffle: s.toggleShuffle,
		})),
	);

	return (
		<Button
			variant={isShuffling ? "default" : "ghost"}
			size="icon-lg"
			aria-label={isShuffling ? "Disable Looping" : "Enable Looping"}
			onClick={toggleShuffle}
			disabled={disabled}
		>
			<Shuffle />
		</Button>
	);
};
