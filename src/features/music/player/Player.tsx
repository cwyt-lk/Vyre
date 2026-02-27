"use client";

import {
	LoopButton,
	PlayPauseButton,
	ShuffleButton,
	SkipNextButton,
} from "@/features/music/player/controls/playback";
import {
	SeekBar,
	TimeDisplay,
} from "@/features/music/player/controls/progress";
import {
	VolumeBar,
	VolumeButton,
} from "@/features/music/player/controls/volume";

export const Player = () => {
	return (
		<div className="py-4 w-3/4">
			<div className="flex flex-col gap-8 justify-center items-center">
				<div className="flex flex-col gap-4 w-full">
					<TimeDisplay />
					<SeekBar />
				</div>

				<div className="grid grid-cols-3 gap-4 justify-center items-center w-full">
					<div className="flex flex-row gap-2 items-center w-full">
						<LoopButton />
						<ShuffleButton />
					</div>

					<div className="flex flex-row gap-2 items-center w-full">
						<SkipNextButton reverse />
						<PlayPauseButton />
						<SkipNextButton />
					</div>

					<div className="flex flex-row gap-2 items-center w-full">
						<VolumeButton />
						<VolumeBar />
					</div>
				</div>
			</div>
		</div>
	);
};
