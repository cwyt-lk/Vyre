import { z } from "zod";

/**
 * Constraints
 */
export const MAX_AUDIO_SIZE = 100 * 1024 * 1024; // 100MB

/**
 * Shared fields between Client (Form) and Server (API/DB).
 * Keeping this central prevents validation drift.
 */
const trackBaseSchema = z.object({
	title: z.string().trim().min(1, "Title is required"),

	// Array of Artist IDs; requires at least one primary artist
	artistIds: z
		.array(z.string().min(1))
		.min(1, "At least one artist is required")
		.default([]),

	genreId: z.string().trim().min(1, "Genre is required"),
});

/**
 * CLIENT SCHEMA
 * Used in React Hook Form / TanStack Form.
 * Validates the raw File object before upload.
 */
export const addTrackClientSchema = trackBaseSchema.extend({
	audioFile: z
		.instanceof(File, { message: "Audio file is required" })
		.refine(
			(file) => file.size <= MAX_AUDIO_SIZE,
			"File must be under 100MB",
		)
		.refine(
			(file) => file.type.startsWith("audio/"),
			"Only audio files (mp3, wav, flac) are allowed",
		),
});

/**
 * SERVER SCHEMA
 * Used in API routes or Server Actions.
 * Validates the file path/URL returned from S3/Storage.
 */
export const addTrackServerSchema = trackBaseSchema.extend({
	audioPath: z.string().min(1, "Audio path is required"),
});

// --- Types & Defaults ---

export type AddTrackClientInput = z.infer<typeof addTrackClientSchema>;
export type AddTrackServerInput = z.infer<typeof addTrackServerSchema>;

export const addTrackClientDefaultValues: Partial<AddTrackClientInput> = {
	title: "",
	artistIds: [],
	genreId: "",
};
