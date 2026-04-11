import { z } from "zod";
import { createArtistSchema } from "./createSchema";

export const updateArtistSchema = createArtistSchema.partial().extend({
	id: z.string(),
});

export type UpdateArtistInput = z.infer<typeof updateArtistSchema>;
