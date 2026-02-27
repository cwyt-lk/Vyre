import { create } from "zustand";
import { audioEngine } from "@/lib/audio/audio-engine";
import { generateShuffleOrder } from "@/lib/utils/array";
import { getTrackUrl } from "@/lib/utils/storage";
import type { Track } from "@/types/domain/track";

type LoopMode = "off" | "track" | "playlist";

interface AudioPlayerState {
	// --- State ---
	isLoading: boolean;
	isReady: boolean;
	error: Error | null;
	isPlaying: boolean;

	queue: Track[];
	currentIndex: number;
	currentTrack: Track | null;

	currentTime: number;
	duration: number;

	volume: number;
	isMuted: boolean;
	loopMode: LoopMode;

	isShuffling: boolean;
	shuffleOrder: number[];

	// --- Actions ---
	setQueue: (tracks: Track[], startIndex?: number) => void;
	addToQueue: (track: Track) => void;
	clearQueue: () => void;

	playByIndex: (index: number) => void;
	playNext: () => void;
	playPrevious: () => void;

	seek: (time: number) => void;
	play: () => void;
	pause: () => void;
	stop: () => void;
	togglePlay: () => void;

	setVolume: (volume: number) => void;
	setMuted: (muted: boolean) => void;
	toggleMute: () => void;

	setLoopMode: (mode: LoopMode) => void;
	cycleLoopMode: () => void;

	setShuffle: (shuffle: boolean) => void;
	toggleShuffle: () => void;
}

const initialState = {
	isLoading: false,
	isReady: false,
	error: null,
	isPlaying: false,
	queue: [],
	currentIndex: -1,
	currentTrack: null,
	currentTime: 0,
	duration: 0,
	volume: audioEngine.getVolume(),
	isMuted: audioEngine.isMuted(),
	loopMode: "off" as LoopMode,
	isShuffling: false,
	shuffleOrder: [],
};

export const useAudioPlayerStore = create<AudioPlayerState>((set, get) => {
	// --- Internal Helpers ---
	const loadTrack = (track: Track, forceAutoplay: boolean = false) => {
		const { volume, isMuted, loopMode, isPlaying } = get();

		set({ currentTrack: track, currentTime: 0, duration: 0 });

		audioEngine.load({
			src: getTrackUrl(track) ?? "",
			volume,
			mute: isMuted,
			loop: loopMode === "track",
			autoplay: forceAutoplay || isPlaying,
		});
	};

	// --- Initialize Audio Engine Listeners ---
	// This runs once when the store is first created
	audioEngine.on("loading", () =>
		set({ isLoading: true, isReady: false, error: null }),
	);

	audioEngine.on("loaded", () =>
		set({
			isLoading: false,
			isReady: true,
			duration: audioEngine.getDuration(),
		}),
	);

	audioEngine.on("unloaded", () =>
		set({
			isReady: false,
			isPlaying: false,
			currentTime: 0,
			duration: 0,
		}),
	);

	audioEngine.on("play", () => set({ isPlaying: true }));
	audioEngine.on("pause", () => set({ isPlaying: false }));
	audioEngine.on("stop", () =>
		set({ isPlaying: false, currentTime: 0 }),
	);

	audioEngine.on("timeUpdate", (time) => set({ currentTime: time }));
	audioEngine.on("seek", (time) => set({ currentTime: time }));
	audioEngine.on("volume", (volume) => set({ volume }));
	audioEngine.on("mute", (isMuted) => set({ isMuted }));
	audioEngine.on("error", (error) => set({ error, isLoading: false }));
	audioEngine.on("end", () => {
		const { playNext, loopMode } = get();
		set({ isPlaying: false });
		if (loopMode !== "track") playNext();
	});

	return {
		...initialState,

		// --- Queue Management ---
		setQueue: (tracks, startIndex = 0) => {
			if (!tracks.length) return;

			const { isShuffling } = get();
			const shuffleOrder = isShuffling
				? generateShuffleOrder(tracks.length, startIndex)
				: [];

			set({ queue: tracks, currentIndex: startIndex, shuffleOrder });
			loadTrack(tracks[startIndex]);
		},

		addToQueue: (track) => {
			set((state) => {
				const newQueue = [...state.queue, track];
				const newIndex = newQueue.length - 1;

				const shuffleOrder = state.isShuffling
					? [...state.shuffleOrder, newIndex]
					: state.shuffleOrder;

				return { queue: newQueue, shuffleOrder };
			});
		},

		clearQueue: () => {
			audioEngine.unload();

			set({
				queue: [],
				currentIndex: -1,
				currentTrack: null,
				shuffleOrder: [],
			});
		},

		// --- Navigation ---
		playByIndex: (index) => {
			const { queue, isShuffling } = get();
			if (!queue[index]) return;

			if (isShuffling) {
				set({
					shuffleOrder: generateShuffleOrder(
						queue.length,
						index,
					),
					currentIndex: index,
				});
			} else {
				set({ currentIndex: index });
			}

			loadTrack(queue[index]);
		},

		playNext: () => {
			const {
				queue,
				currentIndex,
				isShuffling,
				shuffleOrder,
				loopMode,
				stop,
			} = get();

			if (!queue.length) return;

			let nextIdx = -1;

			if (isShuffling && shuffleOrder.length) {
				const currentPos = shuffleOrder.indexOf(currentIndex);

				if (currentPos < shuffleOrder.length - 1)
					nextIdx = shuffleOrder[currentPos + 1];
				else if (loopMode === "playlist")
					nextIdx = shuffleOrder[0];
			} else {
				if (currentIndex < queue.length - 1)
					nextIdx = currentIndex + 1;
				else if (loopMode === "playlist") nextIdx = 0;
			}

			if (nextIdx === -1) return stop();

			set({ currentIndex: nextIdx });
			loadTrack(queue[nextIdx], true);
		},

		playPrevious: () => {
			const {
				queue,
				currentIndex,
				isShuffling,
				shuffleOrder,
				currentTime,
				seek,
			} = get();

			if (!queue.length) return;

			// Reset track if past 3 seconds
			if (currentTime > 3) return seek(0);

			let prevIdx = -1;
			if (isShuffling) {
				const currentPos = shuffleOrder.indexOf(currentIndex);
				if (currentPos > 0) prevIdx = shuffleOrder[currentPos - 1];
			} else {
				if (currentIndex > 0) prevIdx = currentIndex - 1;
			}

			if (prevIdx === -1) return seek(0);
			set({ currentIndex: prevIdx });
			loadTrack(queue[prevIdx], true);
		},

		// --- Playback Controls ---
		seek: (time) => audioEngine.seek(time),
		play: () => audioEngine.play(),
		pause: () => audioEngine.pause(),
		stop: () => audioEngine.stop(),
		togglePlay: () => (get().isPlaying ? get().pause() : get().play()),

		// --- Volume & Audio Settings ---
		setVolume: (volume) => {
			audioEngine.setVolume(volume);
			set({ volume });
		},

		setMuted: (muted) => {
			audioEngine.setMuted(muted);
			set({ isMuted: muted });
		},

		toggleMute: () => get().setMuted(!get().isMuted),

		// --- Modes ---
		setLoopMode: (mode) => {
			set({ loopMode: mode });
			audioEngine.setLooping(mode === "track");
		},

		cycleLoopMode: () => {
			const modes: LoopMode[] = ["off", "track", "playlist"];
			const nextMode =
				modes[(modes.indexOf(get().loopMode) + 1) % modes.length];
			get().setLoopMode(nextMode);
		},

		setShuffle: (shuffle) => {
			const { queue, currentIndex, isShuffling } = get();
			if (shuffle === isShuffling) return;

			const order =
				shuffle && queue.length
					? generateShuffleOrder(queue.length, currentIndex)
					: [];
			set({ isShuffling: shuffle, shuffleOrder: order });
		},

		toggleShuffle: () => get().setShuffle(!get().isShuffling),
	};
});
