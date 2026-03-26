"use server";

import { z } from "zod";
import {
	type UpdateAlbumServerInput,
	updateAlbumServerSchema,
} from "@/features/admin/album/schemas/updateSchema";
import { createRepositories } from "@/lib/factories/repository/server";
import type { AlbumRepositoryContract } from "@/lib/repositories";
import type { Album, UpdateAlbum } from "@/types/domain";
import type { ActionResult } from "@/types/results";

export async function updateAlbumAction(
	data: UpdateAlbumServerInput,
): Promise<ActionResult> {
	const parsed = updateAlbumServerSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const updateData = parsed.data as UpdateAlbum;
	const { albums } = await createRepositories();

	const id = updateData.id;
	const trackIds = parsed.data.trackIds;

	const existing = await getExistingAlbum(albums, id);

	if (!existing.success) {
		return existing;
	}

	const { album, trackIds: existingTrackIds } = existing.data;

	const albumUpdateResult = await maybeUpdateAlbum(
		albums,
		updateData,
		album,
	);

	if (!albumUpdateResult.success) {
		return albumUpdateResult;
	}

	const trackUpdateResult = await syncTracks(
		albums,
		id,
		existingTrackIds,
		trackIds,
	);

	if (!trackUpdateResult.success) {
		return trackUpdateResult;
	}

	return { success: true };
}

//
// -----------------------------
// Helpers
// -----------------------------
//

async function getExistingAlbum(
	albums: AlbumRepositoryContract,
	id: string,
): Promise<
	ActionResult<{
		album: Album;
		trackIds: string[];
	}>
> {
	const result = await albums.findByIdWithRelations(id);

	if (!result.success) {
		return {
			success: false,
			error: "Failed to retrieve album.",
		};
	}

	return {
		success: true,
		data: {
			album: result.data,
			trackIds: result.data.tracks.map((t) => t.id),
		},
	};
}

async function maybeUpdateAlbum(
	albums: AlbumRepositoryContract,
	updateData: UpdateAlbum,
	existingAlbum: Album,
): Promise<ActionResult> {
	if (!hasAlbumChanges(updateData, existingAlbum)) {
		return { success: true };
	}

	const result = await albums.update(updateData);

	if (!result.success) {
		return {
			success: false,
			error: "Failed to update album. Please try again.",
		};
	}

	return { success: true };
}

function hasAlbumChanges(
	updateData: UpdateAlbum,
	existing: Album,
): boolean {
	return (
		updateData.title !== existing.title ||
		updateData.description !== existing.description ||
		updateData.releaseDate !== existing.releaseDate ||
		updateData.coverPath !== existing.coverPath
	);
}

async function syncTracks(
	albums: AlbumRepositoryContract,
	albumId: string,
	existingTrackIds: string[],
	incomingTrackIds?: string[],
): Promise<ActionResult> {
	if (!incomingTrackIds) {
		return { success: true };
	}

	const isSame = isSameOrder(existingTrackIds, incomingTrackIds);

	if (isSame) {
		return { success: true };
	}

	const { toAdd, toRemove } = diffTrackIds(
		existingTrackIds,
		incomingTrackIds,
	);

	const mutationResult = await applyTrackMutations(
		albums,
		albumId,
		toAdd,
		toRemove,
	);

	if (!mutationResult.success) {
		return mutationResult;
	}

	const shouldReorder = toAdd.length > 0 || !isSame;

	if (shouldReorder) {
		const reorderResult = await albums.reorderTracks(
			albumId,
			incomingTrackIds,
		);

		if (!reorderResult.success) {
			return {
				success: false,
				error: "Failed to reorder tracks.",
			};
		}
	}

	return { success: true };
}

function isSameOrder(a: string[], b: string[]): boolean {
	return a.length === b.length && a.every((id, i) => id === b[i]);
}

function diffTrackIds(existing: string[], incoming: string[]) {
	const existingSet = new Set(existing);
	const incomingSet = new Set(incoming);

	return {
		toAdd: incoming.filter((id) => !existingSet.has(id)),
		toRemove: existing.filter((id) => !incomingSet.has(id)),
	};
}

async function applyTrackMutations(
	albums: AlbumRepositoryContract,
	albumId: string,
	toAdd: string[],
	toRemove: string[],
): Promise<ActionResult> {
	const promises = [];

	if (toRemove.length) {
		promises.push(albums.removeTracks(albumId, toRemove));
	}

	if (toAdd.length) {
		promises.push(albums.addTracks(albumId, toAdd));
	}

	if (!promises.length) {
		return { success: true };
	}

	const results = await Promise.all(promises);

	if (results.some((r) => !r.success)) {
		return {
			success: false,
			error: "Failed to update album tracks.",
		};
	}

	return { success: true };
}
