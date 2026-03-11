import { z } from "zod";
import { capitalizeWords } from "@/lib/utils/string";

/**
 * Validates Artist creation/editing.
 * Automatically capitalizes the name for UI consistency.
 */
export const addArtistSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(128, "Name is too long")
		.transform(capitalizeWords), // Ensures "john doe" becomes "John Doe"

	bio: z.string().trim().max(300, "Bio is too long").optional(),
});

export type AddArtistInput = z.infer<typeof addArtistSchema>;

export const addArtistDefaultValues: AddArtistInput = {
	name: "",
	bio: "",
};
