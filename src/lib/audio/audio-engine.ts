import "client-only";

import EventEmitter from "eventemitter3";
import { Howl, type HowlOptions } from "howler";

/**
 * Typed event map for the AudioEngine.
 * Provides strong typing for all emitted events.
 */
interface AudioEngineEvents {
	/** Fired when audio starts loading */
	loading: () => void;

	/** Fired when audio is fully loaded */
	loaded: () => void;

	/** Fired when audio is unloaded */
	unloaded: () => void;

	/** Fired when playback starts */
	play: () => void;

	/** Fired when playback is paused */
	pause: () => void;

	/** Fired when playback is stopped */
	stop: () => void;

	/** Fired when playback reaches the end */
	end: () => void;

	/** Fired when seeking occurs */
	seek: (time: number) => void;

	/** Fired continuously during playback with current time (seconds) */
	timeUpdate: (time: number) => void;

	/** Fired when volume changes */
	volume: (volume: number) => void;

	/** Fired when mute state changes */
	mute: (isMuted: boolean) => void;

	/** Fired when loop state changes */
	loop: (isLooping: boolean) => void;

	/** Fired when an error occurs */
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
 *
 * @example
 * ```ts
 * audioEngine.load({ src: "/audio.mp3", autoplay: true });
 * audioEngine.on("play", () => console.log("Playing"));
 * ```
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
	static getInstance(): AudioEngine {
		if (!AudioEngine.instance) {
			AudioEngine.instance = new AudioEngine();
		}

		return AudioEngine.instance;
	}

	/**
	 * Loads an audio source and initializes the Howl instance.
	 * Automatically unloads any existing audio before loading a new one.
	 *
	 * @param options - Configuration for the audio instance
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
	}: AudioEngineLoadOptions): void {
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

			onload: () => {
				this.emit("loaded");
			},

			onloaderror: (_, error) => {
				this.emit("error", error as Error);
			},

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
	unload(): void {
		if (!this.howl) return;

		this.howl.stop();
		this.howl.unload();
		this.howl = null;

		this.emit("unloaded");
	}

	/**
	 * Starts playback.
	 */
	play(): void {
		if (!this.howl) return;
		this.howl.play();
	}

	/**
	 * Pauses playback.
	 */
	pause(): void {
		if (!this.howl) return;
		this.howl.pause();
	}

	/**
	 * Stops playback.
	 */
	stop(): void {
		if (!this.howl) return;
		this.howl.stop();
	}

	/**
	 * Seeks to a specific time.
	 *
	 * @param time - Time in seconds
	 */
	seek(time: number): void {
		this.howl?.seek(time);
	}

	/**
	 * Sets volume.
	 *
	 * @param volume - Value between 0.0 and 1.0
	 */
	setVolume(volume: number): void {
		this.howl?.volume(volume);
	}

	/**
	 * Gets current volume.
	 *
	 * @returns Volume between 0.0 and 1.0
	 */
	getVolume(): number {
		return this.howl?.volume() ?? 1;
	}

	/**
	 * Sets mute state.
	 *
	 * @param muted - Whether audio should be muted
	 */
	setMuted(muted: boolean): void {
		this.howl?.mute(muted);
	}

	/**
	 * Returns mute state.
	 */
	isMuted(): boolean {
		return this.howl?.mute() ?? false;
	}

	/**
	 * Enables or disables looping.
	 *
	 * @param isLooping - Whether playback should loop
	 */
	setLooping(isLooping: boolean): void {
		if (!this.howl) return;

		this.howl.loop(isLooping);
		this.emit("loop", isLooping);
	}

	/**
	 * Returns loop state.
	 */
	isLooping(): boolean {
		return this.howl?.loop() ?? false;
	}

	/**
	 * Returns whether audio is currently playing.
	 */
	isPlaying(): boolean {
		return this.howl?.playing() ?? false;
	}

	/**
	 * Returns current playback time.
	 *
	 * @returns Time in seconds
	 */
	getCurrentTime(): number {
		return this.howl?.seek() ?? 0;
	}

	/**
	 * Returns total duration of the loaded audio.
	 *
	 * @returns Duration in seconds
	 */
	getDuration(): number {
		return this.howl?.duration() ?? 0;
	}

	/**
	 * Starts emitting `timeUpdate` events using requestAnimationFrame.
	 * Runs only while audio is actively playing.
	 */
	private startProgressLoop(): void {
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
	private stopProgressLoop(): void {
		if (this.timeRaf) {
			cancelAnimationFrame(this.timeRaf);
		}

		this.timeRaf = null;
	}
}

/**
 * Singleton AudioEngine instance.
 *
 * Use this instead of creating new instances manually.
 *
 * @example
 * ```ts
 * audioEngine.play();
 * audioEngine.setVolume(0.5);
 * ```
 */
export const audioEngine = AudioEngine.getInstance();
