import type { z } from "zod";
import {
	createAlbumClientSchema,
	createAlbumServerSchema,
} from "@/features/admin/album/schemas/createSchema";

// Client-side schema for form handling (partial allows optional fields)
export const updateAlbumClientSchema = createAlbumClientSchema.partial();

// Server-side schema for processing (partial allows optional fields)
export const updateAlbumServerSchema = createAlbumServerSchema.partial();

// Types
export type UpdateAlbumClientInput = z.infer<
	typeof updateAlbumClientSchema
>;

export type UpdateAlbumServerInput = z.infer<
	typeof updateAlbumServerSchema
>;
