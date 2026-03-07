import { z } from "zod";

export const MAX_AUDIO_SIZE = 100 * 1024 * 1024; // 100MB

export const addTrackClientSchema = z.object({
	title: z.string().min(1, "Title is required").trim(),

	artistIds: z
		.array(z.string().min(1, "Artist is required").trim())
		.min(1, "Artist is required"),

	genreId: z.string().min(1, "Genre is required").trim(),

	description: z.string().trim().optional(),

	audioFile: z
		.instanceof(File, { message: "File is required" })
		.refine(
			(file) => file.size <= MAX_AUDIO_SIZE,
			"File size must be under 100MB",
		)
		.refine(
			(file) => file.type.startsWith("audio/"),
			"Only audio files are allowed",
		),
});

export const addTrackServerSchema = z.object({
	title: z.string().min(1).trim(),

	artistIds: z.array(z.string()).min(1),

	genreId: z.string(),

	description: z.string().optional(),

	audioPath: z.string(),
});

export type AddTrackServerInput = z.infer<typeof addTrackServerSchema>;
export type AddTrackClientInput = z.infer<typeof addTrackClientSchema>;

export const addTrackClientDefaultValues: Partial<AddTrackClientInput> = {
	title: "",
	artistIds: [],
	genreId: "",
	description: "",
};
