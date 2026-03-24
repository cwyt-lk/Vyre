import { z } from "zod";
import {
	createTrackClientSchema,
	createTrackServerSchema,
} from "./createSchema";

// Client-side schema for form handling (partial allows optional fields)
export const updateTrackClientSchema = createTrackClientSchema
	.partial()
	.extend({
		id: z.string(),
	});

// Server-side schema for processing (partial allows optional fields)
export const updateTrackServerSchema = createTrackServerSchema
	.partial()
	.extend({
		id: z.string(),
	});

// Types
export type UpdateTrackClientInput = z.infer<
	typeof updateTrackClientSchema
>;

export type UpdateTrackServerInput = z.infer<
	typeof updateTrackServerSchema
>;
