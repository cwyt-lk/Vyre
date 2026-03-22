"use client";

import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAudioPlayerStore } from "@/lib/audio/useAudioPlayerStore";

export const useSeekBar = () => {
	const {
		currentTime,
		duration,
		seek,
		isLoading,
		isPlaying,
		pause,
		play,
	} = useAudioPlayerStore(
		useShallow((s) => ({
			currentTime: s.currentTime,
			duration: s.duration,
			seek: s.seek,
			isLoading: s.isLoading,
			isPlaying: s.isPlaying,
			play: s.play,
			pause: s.pause,
		})),
	);

	const [isSeeking, setIsSeeking] = useState(false);
	const [localValue, setLocalValue] = useState(0);
	const [wasPlaying, setWasPlaying] = useState(false);

	const handleValueChange = (value: number | readonly number[]) => {
		if (!isSeeking) {
			setIsSeeking(true);

			if (isPlaying) {
				setWasPlaying(true);
				pause();
			}
		}

		const newValue = Array.isArray(value) ? value[0] : value;

		seek(newValue);
		setLocalValue(newValue);
	};

	const handleValueCommit = (value: number | readonly number[]) => {
		seek(Array.isArray(value) ? value[0] : value);

		setIsSeeking(false);

		if (wasPlaying) play();

		setWasPlaying(false);
	};

	return {
		displayValue: isSeeking ? localValue : currentTime,
		duration,
		isLoading,
		handleValueChange,
		handleValueCommit,
	};
};
