import { z } from "zod";
import {
	createAlbumClientSchema,
	createAlbumServerSchema,
} from "@/features/admin/album/schemas/createSchema";

// Client-side schema for form handling (partial allows optional fields)
export const updateAlbumClientSchema = createAlbumClientSchema
	.partial()
	.extend({
		id: z.string(),
	});

// Server-side schema for processing (partial allows optional fields)
export const updateAlbumServerSchema = createAlbumServerSchema
	.partial()
	.extend({
		id: z.string(),
	});

// Types
export type UpdateAlbumClientInput = z.infer<
	typeof updateAlbumClientSchema
>;

export type UpdateAlbumServerInput = z.infer<
	typeof updateAlbumServerSchema
>;
