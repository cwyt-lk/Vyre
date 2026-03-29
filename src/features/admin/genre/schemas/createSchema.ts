import { z } from "zod";
import { capitalizeWords } from "@/lib/utils/string";

/**
 * Validates Genre categorization.
 * 'key' is used for URL slugs (e.g., /genre/hip-hop).
 * 'label' is used for display (e.g., "Hip Hop").
 */
export const createGenreSchema = z.object({
	key: z
		.string()
		.trim()
		.toLowerCase()
		.min(2, "Key must be at least 2 characters")
		.max(30, "Key is too long")
		.regex(
			/^[a-z0-9-]+$/,
			"Key can only contain letters, numbers, and hyphens",
		),

	label: z
		.string()
		.trim()
		.min(2, "Label must be at least 2 characters")
		.max(50, "Label is too long")
		.transform(capitalizeWords),
});

export type CreateGenreInput = z.infer<typeof createGenreSchema>;

export const genreDefaultValues: Partial<CreateGenreInput> = {
	key: "",
	label: "",
};
