import { z } from "zod";
import { createGenreSchema } from "./createSchema";

export const updateGenreSchema = createGenreSchema.partial().extend({
	id: z.string(),
});

export type UpdateGenreInput = z.infer<typeof updateGenreSchema>;
