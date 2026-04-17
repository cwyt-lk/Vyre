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
		<div className="w-full max-w-5xl">
			<div className="flex flex-col gap-6">
				{/* Progress Section */}
				<div className="flex flex-col gap-3 mb-4">
					<TimeDisplay />
					<SeekBar />
				</div>

				{/* Main Controls */}
				<div className="flex flex-col gap-6">
					{/* Playback Controls - Center Focal Point */}
					<div className="flex justify-center items-center gap-6">
						<div className="flex items-center gap-3">
							<LoopButton />
							<ShuffleButton />
						</div>

						<div className="flex items-center gap-4">
							<SkipNextButton reverse />

							<div className="scale-110">
								<PlayPauseButton />
							</div>

							<SkipNextButton />
						</div>

						<div className="flex items-center gap-3 flex-1 justify-end max-w-50">
							<VolumeButton />
							<VolumeBar />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
