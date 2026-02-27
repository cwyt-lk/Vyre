"use client";

import { Repeat, Repeat1 } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/Button";
import { useAudioPlayerStore } from "@/lib/audio/useAudioPlayerStore";

interface LoopButtonProps {
	disabled?: boolean;
}

export const LoopButton = ({ disabled }: LoopButtonProps) => {
	const { loopMode, cycleLoopMode } = useAudioPlayerStore(
		useShallow((s) => ({
			loopMode: s.loopMode,
			cycleLoopMode: s.cycleLoopMode,
		})),
	);

	const isLooping = loopMode !== "off";

	return (
		<Button
			variant={isLooping ? "default" : "ghost"}
			size="icon-lg"
			aria-label={isLooping ? "Disable Looping" : "Enable Looping"}
			onClick={cycleLoopMode}
			disabled={disabled}
		>
			{loopMode === "track" ? <Repeat1 /> : <Repeat />}
		</Button>
	);
};
