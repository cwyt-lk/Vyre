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
			className={`
                transition-all
                duration-200
                hover:scale-110
                active:scale-95
                ${isLooping ? "shadow-md" : ""}
            `}
		>
			<span className="transition-transform duration-200 group-hover:scale-110">
				{loopMode === "track" ? <Repeat1 /> : <Repeat />}
			</span>
		</Button>
	);
};
