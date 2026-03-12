import { z } from "zod";
import { getHumanSize } from "@/lib/utils/file";

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Base schema containing shared logic for both Client and Server.
 */
const albumBaseSchema = z.object({
	title: z.string().trim().min(1, "Title is required"),
	releaseDate: z.date("Please select a release date"),
	description: z.string().trim().optional(),
	trackIds: z.array(z.string().min(1)).default([]),
});

/**
 * Schema for Client-side form handling (includes File object)
 */
export const addAlbumClientSchema = albumBaseSchema.extend({
	coverFile: z
		.instanceof(File, { message: "Cover image is required." })
		.refine((file) => file.size <= MAX_IMAGE_SIZE, {
			message: `File size must be under ${getHumanSize(MAX_IMAGE_SIZE)}`,
		})
		.refine((file) => file.type.startsWith("image/"), {
			message: "Only image files are allowed",
		}),
});

/**
 * Schema for Server-side processing (includes storage path)
 */
export const addAlbumServerSchema = albumBaseSchema.extend({
	coverPath: z.string().min(1, "Cover path is required"),
});

// --- Types ---

export type AddAlbumClientInput = z.infer<typeof addAlbumClientSchema>;
export type AddAlbumServerInput = z.infer<typeof addAlbumServerSchema>;

// --- Defaults ---

export const addAlbumClientDefaultValues: Partial<AddAlbumClientInput> = {
	title: "",
	description: "",
	trackIds: [],
};
