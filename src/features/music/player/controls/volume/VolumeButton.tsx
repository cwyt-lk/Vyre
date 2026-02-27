"use client";

import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/Button";
import { useAudioPlayerStore } from "@/lib/audio/useAudioPlayerStore";

// --- Private ---
interface VolumeIconProps {
	volume: number;
	size?: number;
	className?: string;
}

const VolumeIcon = ({ volume, size, className }: VolumeIconProps) => {
	if (volume === 0) return <VolumeX size={size} className={className} />;
	if (volume <= 0.33)
		return <Volume size={size} className={className} />;
	if (volume < 0.66)
		return <Volume1 size={size} className={className} />;
	return <Volume2 size={size} className={className} />;
};

// --- Public ---
interface VolumeButtonProps {
	disabled?: boolean;
}

export const VolumeButton = ({ disabled }: VolumeButtonProps) => {
	const { toggleMute, isMuted, volume, isLoading } = useAudioPlayerStore(
		useShallow((s) => ({
			toggleMute: s.toggleMute,
			isMuted: s.isMuted,
			volume: s.volume,
			isLoading: s.isLoading,
		})),
	);

	return (
		<Button
			variant="ghost"
			size="icon-lg"
			onClick={toggleMute}
			disabled={disabled || isLoading}
			aria-label={isMuted ? "Unmute" : "Mute"}
		>
			<VolumeIcon volume={isMuted ? 0 : volume} className="size-5" />
		</Button>
	);
};
