import { z } from "zod";
import { capitalizeWords } from "@/lib/utils/string";

export const addArtistSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(128, "Name is too long")
		.trim()
		.transform(capitalizeWords),

	bio: z.string().trim().max(300, "Bio is too long").optional(),
});

export type AddArtistInput = z.infer<typeof addArtistSchema>;

export const addArtistDefaultValues: AddArtistInput = {
	name: "",
	bio: "",
};
