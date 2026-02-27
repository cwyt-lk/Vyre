"use client";

import { useShallow } from "zustand/react/shallow";
import { Slider } from "@/components/ui/Slider";
import { useAudioPlayerStore } from "@/lib/audio/useAudioPlayerStore";
import { cn } from "@/lib/utils/cn";

interface VolumeBarProps {
	className?: string;
	disabled?: boolean;
}

export const VolumeBar = ({ className, disabled }: VolumeBarProps) => {
	const { volume, setVolume, isLoading } = useAudioPlayerStore(
		useShallow((s) => ({
			volume: s.volume,
			setVolume: s.setVolume,
			isLoading: s.isLoading,
		})),
	);

	return (
		<Slider
			aria-label="Volume Slider"
			value={[volume * 1000]}
			min={0}
			max={1000}
			disabled={disabled || isLoading}
			onValueChange={(value) => {
				setVolume(
					(Array.isArray(value) ? value[0] : value) / 1000,
				);
			}}
			className={cn("transition-all duration-200", className)}
		/>
	);
};
