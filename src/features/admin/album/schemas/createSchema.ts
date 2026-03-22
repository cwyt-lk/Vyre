import { z } from "zod";

import { MAX_IMAGE_SIZE } from "@/features/admin/album/config";
import { getHumanSize } from "@/lib/utils/file";

// Shared client-side image validation
const imageFileSchema = z
	.instanceof(File, { message: "Cover image is required." })
	.refine((file) => file.size <= MAX_IMAGE_SIZE, {
		message: `File size must be under ${getHumanSize(MAX_IMAGE_SIZE)}`,
	})
	.refine((file) => file.type.startsWith("image/"), {
		message: "Only image files are allowed",
	});

// Base Schema
const albumBaseSchema = z.object({
	title: z.string().trim().min(1, "Title is required"),
	releaseDate: z.date("Please select a release date"),
	description: z.string().trim().optional(),
	trackIds: z.array(z.string().min(1)).default([]),
});

// Client-side schema for form handling (includes File object)
export const createAlbumClientSchema = albumBaseSchema.extend({
	coverFile: imageFileSchema,
});

// Server-side schema for processing (includes storage path)
export const createAlbumServerSchema = albumBaseSchema.extend({
	coverPath: z.string().min(1, "Cover path is required"),
});

// Types
export type CreateAlbumClientInput = z.infer<
	typeof createAlbumClientSchema
>;
export type CreateAlbumServerInput = z.infer<
	typeof createAlbumServerSchema
>;

// Default Values
export const albumClientDefaultValues: Partial<CreateAlbumClientInput> = {
	title: "",
	description: "",
	trackIds: [],
};
