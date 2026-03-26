import { create } from "zustand";
import { audioEngine } from "@/lib/audio/audio-engine";
import { generateShuffleOrder } from "@/lib/utils/array";

/**
 * Looping behavior for playback.
 * - "off": No looping
 * - "track": Repeat the current track
 * - "playlist": Loop through the entire queue
 */
type LoopMode = "off" | "track" | "playlist";

/**
 * Represents a playable audio track.
 */
interface PlaybackTrack {
	/** Unique identifier for the track */
	id: string;
	/** Source URL or file path */
	src: string;
	/** Track title */
	title: string;
	/** Track artist */
	artist: string;
}

/**
 * Zustand store shape for the audio player.
 */
interface AudioPlayerState {
	// --- State ---

	/** Whether a track is currently loading */
	isLoading: boolean;

	/** Whether the audio engine is ready to play */
	isReady: boolean;

	/** Last playback error, if any */
	error: Error | null;

	/** Whether audio is currently playing */
	isPlaying: boolean;

	/** Identifier for the current source (e.g., playlist ID) */
	activeSourceId: string | null;

	/** Playback queue */
	queue: PlaybackTrack[];

	/** Current index in the queue */
	currentIndex: number;

	/** Currently loaded track */
	currentTrack: PlaybackTrack | null;

	/** Current playback time (seconds) */
	currentTime: number;

	/** Track duration (seconds) */
	duration: number;

	/** Volume level (0–1) */
	volume: number;

	/** Whether audio is muted */
	isMuted: boolean;

	/** Current loop mode */
	loopMode: LoopMode;

	/** Whether shuffle mode is enabled */
	isShuffling: boolean;

	/** Order of shuffled indices */
	shuffleOrder: number[];

	// --- Actions ---

	/**
	 * Replace the queue and begin playback from the first track.
	 * @param tracks List of tracks to queue
	 * @param sourceId Optional identifier for the source of the queue
	 */
	setQueue: (tracks: PlaybackTrack[], sourceId: string | null) => void;

	/**
	 * Add a track to the end of the queue.
	 * @param track Track to append
	 */
	addToQueue: (track: PlaybackTrack) => void;

	/** Clear the queue and unload the current track */
	clearQueue: () => void;

	/**
	 * Play a track at a specific index.
	 * Respects shuffle mode by regenerating shuffle order.
	 * @param index Index in the queue
	 */
	playByIndex: (index: number) => void;

	/** Play the next track based on shuffle and loop settings */
	playNext: () => void;

	/**
	 * Play the previous track.
	 * If current time > 3 seconds, restarts the current track instead.
	 */
	playPrevious: () => void;

	/**
	 * Seek to a specific time in the current track.
	 * @param time Time in seconds
	 */
	seek: (time: number) => void;

	/** Start playback */
	play: () => void;

	/** Pause playback */
	pause: () => void;

	/** Stop playback and reset time */
	stop: () => void;

	/** Toggle between play and pause */
	togglePlay: () => void;

	/**
	 * Set playback volume.
	 * @param volume Value between 0 and 1
	 */
	setVolume: (volume: number) => void;

	/**
	 * Mute or unmute audio.
	 * @param muted Whether audio should be muted
	 */
	setMuted: (muted: boolean) => void;

	/** Toggle mute state */
	toggleMute: () => void;

	/**
	 * Set loop mode.
	 * @param mode Loop mode
	 */
	setLoopMode: (mode: LoopMode) => void;

	/** Cycle through loop modes: off → track → playlist */
	cycleLoopMode: () => void;

	/**
	 * Enable or disable shuffle mode.
	 * Regenerates shuffle order when enabled.
	 * @param shuffle Whether shuffle should be active
	 */
	setShuffle: (shuffle: boolean) => void;

	/** Toggle shuffle mode */
	toggleShuffle: () => void;
}

const initialState = {
	isLoading: false,
	isReady: false,
	error: null,
	isPlaying: false,
	activeSourceId: null,
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

	/**
	 * Load a track into the audio engine.
	 * Optionally forces autoplay regardless of current play state.
	 *
	 * @param track Track to load
	 * @param forceAutoplay If true, playback starts immediately
	 */
	const loadTrack = (
		track: PlaybackTrack,
		forceAutoplay: boolean = false,
	) => {
		const { volume, isMuted, loopMode, isPlaying } = get();

		set({ currentTrack: track, currentTime: 0, duration: 0 });

		audioEngine.load({
			src: track.src,
			volume,
			mute: isMuted,
			loop: loopMode === "track",
			autoplay: forceAutoplay || isPlaying,
		});
	};

	// --- Initialize Audio Engine Listeners ---
	// Runs once when the store is created

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

	/**
	 * When a track ends:
	 * - If loopMode === "track", audioEngine handles replay
	 * - Otherwise, advance to the next track
	 */
	audioEngine.on("end", () => {
		const { playNext, loopMode } = get();
		set({ isPlaying: false });
		if (loopMode !== "track") playNext();
	});

	return {
		...initialState,

		// --- Queue Management ---

		setQueue: (tracks, sourceId = null) => {
			if (!tracks.length) return;

			const startIndex = 0;
			const { isShuffling } = get();

			const shuffleOrder = isShuffling
				? generateShuffleOrder(tracks.length, startIndex)
				: [];

			set({
				queue: tracks,
				currentIndex: startIndex,
				shuffleOrder,
				activeSourceId: sourceId ?? null,
			});

			loadTrack(tracks[0]);
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

				if (currentPos < shuffleOrder.length - 1) {
					nextIdx = shuffleOrder[currentPos + 1];
				} else if (loopMode === "playlist") {
					nextIdx = shuffleOrder[0];
				}
			} else {
				if (currentIndex < queue.length - 1) {
					nextIdx = currentIndex + 1;
				} else if (loopMode === "playlist") {
					nextIdx = 0;
				}
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

			// Restart track if more than 3 seconds in
			if (currentTime > 3) return seek(0);

			let prevIdx = -1;

			if (isShuffling) {
				const currentPos = shuffleOrder.indexOf(currentIndex);

				if (currentPos > 0) {
					prevIdx = shuffleOrder[currentPos - 1];
				}
			} else {
				if (currentIndex > 0) {
					prevIdx = currentIndex - 1;
				}
			}

			if (prevIdx === -1) {
				return seek(0);
			}

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
			const { setLoopMode, loopMode } = get();

			const modes: LoopMode[] = ["off", "track", "playlist"];
			const nextMode =
				modes[(modes.indexOf(loopMode) + 1) % modes.length];

			setLoopMode(nextMode);
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

		toggleShuffle: () => {
			const { setShuffle, isShuffling } = get();

			setShuffle(!isShuffling);
		},
	};
});
