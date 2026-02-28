"use client";

import { Slider } from "@/components/ui/Slider";
import { useSeekBar } from "@/features/music/player/hooks/useSeekBar";
import { cn } from "@/lib/utils/cn";

interface SeekBarProps {
	className?: string;
	disabled?: boolean;
}

export const SeekBar = ({ className, disabled }: SeekBarProps) => {
	const {
		displayValue,
		isLoading,
		duration,
		handleValueChange,
		handleValueCommit,
	} = useSeekBar();

	const max = duration > 0 ? duration : 1;

	return (
		<Slider
			aria-label="Seek audio position"
			value={[Math.min(displayValue, max)]}
			min={0}
			max={max}
			step={0.1}
			disabled={disabled || isLoading || duration === 0}
			onValueChange={handleValueChange}
			onValueCommitted={handleValueCommit}
			className={cn("cursor-pointer", className)}
		/>
	);
};
