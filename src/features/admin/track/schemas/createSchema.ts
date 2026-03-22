import { z } from "zod";
import { MAX_AUDIO_SIZE } from "@/features/admin/track/config";

// Shared client-side audio validation
const audioFileSchema = z
	.instanceof(File, { message: "Audio file is required" })
	.refine((file) => file.size <= MAX_AUDIO_SIZE, {
		message: `File must be under ${MAX_AUDIO_SIZE / (1024 * 1024)}MB`,
	})
	.refine((file) => file.type.startsWith("audio/"), {
		message: "Only audio files (mp3, wav, flac) are allowed",
	});

// Base Schema
const trackBaseSchema = z.object({
	title: z.string().trim().min(1, "Title is required"),

	// Array of Artist IDs; requires at least one primary artist
	artistIds: z
		.array(z.string().min(1))
		.min(1, "At least one artist is required")
		.default([]),

	genreId: z.string().trim().min(1, "Genre is required"),
});

// Client-side schema for form handling (includes File object)
export const createTrackClientSchema = trackBaseSchema.extend({
	audioFile: audioFileSchema,
});

// Server-side schema for processing (includes storage path)
export const createTrackServerSchema = trackBaseSchema.extend({
	audioPath: z.string().min(1, "Audio path is required"),
});

// Types
export type CreateTrackClientInput = z.infer<
	typeof createTrackClientSchema
>;
export type CreateTrackServerInput = z.infer<
	typeof createTrackServerSchema
>;

// Default Value
export const trackClientDefaultValues: Partial<CreateTrackClientInput> = {
	title: "",
	artistIds: [],
	genreId: "",
};
