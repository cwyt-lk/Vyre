import { z } from "zod";

export const addGenreSchema = z.object({
	key: z
		.string()
		.min(2, "Key must be at least 2 characters")
		.max(30, "Key is too long")
		.trim()
		.toLowerCase()
		.regex(/^[a-z0-9-]+$/, {
			message:
				"Key can only contain letters, numbers, and hyphens (no spaces)",
		}),

	label: z
		.string()
		.min(2, "Label must be at least 2 characters")
		.max(50, "Label is too long")
		.trim()
		.transform((val) => val.charAt(0).toUpperCase() + val.slice(1)),
});

export type AddGenreInput = z.infer<typeof addGenreSchema>;

export const addGenreDefaultValues: AddGenreInput = {
	key: "",
	label: "",
};
