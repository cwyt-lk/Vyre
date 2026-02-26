import "client-only";

import EventEmitter from "eventemitter3";
import { Howl, type HowlOptions } from "howler";

/**
 * Typed event map for the AudioEngine.
 * Provides strong typing for all emitted events.
 */
interface AudioEngineEvents {
	// Loading lifecycle
	loading: () => void;
	loaded: () => void;
	unloaded: () => void;

	// Playback state
	play: () => void;
	pause: () => void;
	stop: () => void;
	end: () => void;

	// Timeline
	seek: (time: number) => void;
	timeUpdate: (time: number) => void;

	// Audio controls
	volume: (volume: number) => void;
	mute: (isMuted: boolean) => void;
	loop: (isLooping: boolean) => void;

	// Error handling
	error: (error: Error) => void;
}

/**
 * Configuration options used when loading an audio file.
 */
export interface AudioEngineLoadOptions {
	/** Audio source URL(s) */
	src: string | string[];

	/** Initial volume (0.0 - 1.0) */
	volume?: number;

	/** Whether audio starts muted */
	mute?: boolean;

	/** Whether audio should autoplay after loading */
	autoplay?: boolean;

	/** Use HTML5 Audio instead of Web Audio API */
	html5?: boolean;

	/** Whether to preload audio */
	preload?: boolean;

	/** Whether playback should loop */
	loop?: boolean;

	/** Additional Howler.js configuration overrides */
	howlOptions?: Partial<HowlOptions>;
}

/**
 * AudioEngine
 *
 * A singleton wrapper around Howler.js that:
 * - Provides a typed event system
 * - Manages playback state
 * - Emits time updates using requestAnimationFrame
 * - Centralizes audio control logic
 */
class AudioEngine extends EventEmitter<AudioEngineEvents> {
	/** Singleton instance */
	private static instance: AudioEngine;

	/** Internal Howler instance */
	private howl: Howl | null = null;

	/** requestAnimationFrame ID for progress tracking */
	private timeRaf: number | null = null;

	/**
	 * Returns the singleton instance of AudioEngine.
	 */
	static getInstance() {
		if (!AudioEngine.instance) {
			AudioEngine.instance = new AudioEngine();
		}

		return AudioEngine.instance;
	}

	/**
	 * Loads an audio source and initializes the Howl instance.
	 * Automatically unloads any existing audio before loading a new one.
	 */
	load({
		src,
		volume = 1,
		mute = false,
		autoplay = false,
		html5 = true,
		preload = true,
		loop = false,
		howlOptions = {},
	}: AudioEngineLoadOptions) {
		// Ensure previous audio is cleaned up
		this.unload();

		this.howl = new Howl({
			src,
			volume,
			mute,
			autoplay,
			html5,
			preload,
			loop,
			...howlOptions,

			// Playback events
			onplay: () => {
				this.emit("play");
				this.startProgressLoop();
			},

			onpause: () => {
				this.emit("pause");
				this.stopProgressLoop();
			},

			onstop: () => {
				this.emit("stop");
				this.stopProgressLoop();
			},

			onend: () => {
				this.emit("end");
				this.stopProgressLoop();
			},

			onseek: () => {
				this.emit("seek", this.getCurrentTime());
			},

			// Loading events
			onload: () => {
				this.emit("loaded");
			},

			onloaderror: (_, error) => {
				this.emit("error", error as Error);
			},

			// Audio property events
			onvolume: () => {
				this.emit("volume", this.getVolume());
			},

			onmute: () => {
				this.emit("mute", this.isMuted());
			},
		});

		this.emit("loading");
	}

	/**
	 * Stops and unloads the current audio instance.
	 */
	unload() {
		if (!this.howl) return;

		this.howl.stop();
		this.howl.unload();
		this.howl = null;

		this.emit("unloaded");
	}

	/** Starts playback */
	play() {
		if (!this.howl) return;

		this.howl.play();
	}

	/** Pauses playback */
	pause() {
		if (!this.howl) return;

		this.howl.pause();
	}

	/** Stops playback */
	stop() {
		if (!this.howl) return;

		this.howl.stop();
	}

	/**
	 * Seeks to a specific time (in seconds).
	 */
	seek(time: number) {
		this.howl?.seek(time);
	}

	/**
	 * Sets volume (0.0 - 1.0).
	 */
	setVolume(volume: number) {
		this.howl?.volume(volume);
	}

	/**
	 * Returns current volume.
	 */
	getVolume() {
		return this.howl?.volume() ?? 1;
	}

	/**
	 * Mutes or unmutes audio.
	 */
	setMuted(muted: boolean) {
		this.howl?.mute(muted);
	}

	/**
	 * Returns mute state.
	 */
	isMuted() {
		return this.howl?.mute() ?? false;
	}

	/**
	 * Enables or disables looping.
	 */
	setLooping(isLooping: boolean) {
		if (!this.howl) return;

		this.howl.loop(isLooping);
		this.emit("loop", isLooping);
	}

	/**
	 * Returns loop state.
	 */
	isLooping() {
		return this.howl?.loop() ?? false;
	}

	/**
	 * Returns whether audio is currently playing.
	 */
	isPlaying() {
		return this.howl?.playing() ?? false;
	}

	/**
	 * Returns current playback time (seconds).
	 */
	getCurrentTime() {
		return this.howl?.seek() ?? 0;
	}

	/**
	 * Returns total duration of the loaded audio (seconds).
	 */
	getDuration() {
		return this.howl?.duration() ?? 0;
	}

	/**
	 * Starts emitting `timeUpdate` events using requestAnimationFrame.
	 * Runs only while audio is actively playing.
	 */
	private startProgressLoop() {
		const loop = () => {
			if (!this.howl || !this.howl.playing()) return;

			this.emit("timeUpdate", this.getCurrentTime());
			this.timeRaf = requestAnimationFrame(loop);
		};

		this.timeRaf = requestAnimationFrame(loop);
	}

	/**
	 * Stops the requestAnimationFrame progress loop.
	 */
	private stopProgressLoop() {
		if (this.timeRaf) {
			cancelAnimationFrame(this.timeRaf);
		}
		this.timeRaf = null;
	}
}

/**
 * Exported singleton instance.
 * Use this throughout the app instead of instantiating manually.
 */
export const audioEngine = AudioEngine.getInstance();
