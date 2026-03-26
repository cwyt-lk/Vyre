"use server";

import { z } from "zod";
import { createRepositories } from "@/lib/factories/repository/server";
import type { TrackRepositoryContract } from "@/lib/repositories";
import type { Track, UpdateTrack } from "@/types/domain";
import type { ActionResult } from "@/types/results";
import {
	type UpdateTrackServerInput,
	updateTrackServerSchema,
} from "../schemas/updateSchema";

export async function updateTrackAction(
	data: UpdateTrackServerInput,
): Promise<ActionResult> {
	const parsed = updateTrackServerSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			error: z.flattenError(parsed.error).formErrors.join(", "),
		};
	}

	const updateData = parsed.data as UpdateTrack;
	const { tracks } = await createRepositories();

	const id = updateData.id;
	const artistIds = parsed.data.artistIds;

	const existing = await getExistingTrack(tracks, id);

	if (!existing.success) {
		return existing;
	}

	const { track, artistIds: existingArtistIds } = existing.data;

	const trackUpdateResult = await maybeUpdateTrack(
		tracks,
		updateData,
		track,
	);

	if (!trackUpdateResult.success) {
		return trackUpdateResult;
	}

	const artistUpdateResult = await syncArtists(
		tracks,
		id,
		existingArtistIds,
		artistIds,
	);

	if (!artistUpdateResult.success) {
		return artistUpdateResult;
	}

	return { success: true };
}

//
// -----------------------------
// Helpers
// -----------------------------
//

async function getExistingTrack(
	tracks: TrackRepositoryContract,
	id: string,
): Promise<
	ActionResult<{
		track: Track;
		artistIds: string[];
	}>
> {
	const result = await tracks.findByIdWithRelations(id);

	if (!result.success) {
		return {
			success: false,
			error: "Failed to retrieve track.",
		};
	}

	return {
		success: true,
		data: {
			track: result.data,
			artistIds: result.data.artists.map((a) => a.id),
		},
	};
}

async function maybeUpdateTrack(
	tracks: TrackRepositoryContract,
	updateData: UpdateTrack,
	existingTrack: Track,
): Promise<ActionResult> {
	if (!hasTrackChanges(updateData, existingTrack)) {
		return { success: true };
	}

	const result = await tracks.update(updateData);

	if (!result.success) {
		return {
			success: false,
			error: "Failed to update track. Please try again.",
		};
	}

	return { success: true };
}

function hasTrackChanges(
	updateData: UpdateTrack,
	existing: Track,
): boolean {
	return (
		updateData.title !== existing.title ||
		updateData.genreId !== existing.genreId ||
		updateData.audioPath !== existing.audioPath
	);
}

async function syncArtists(
	tracks: TrackRepositoryContract,
	trackId: string,
	existingArtistIds: string[],
	incomingArtistIds?: string[],
): Promise<ActionResult> {
	if (!incomingArtistIds) {
		return { success: true };
	}

	const isSame = isSameOrder(existingArtistIds, incomingArtistIds);

	if (isSame) {
		return { success: true };
	}

	const { toAdd, toRemove } = diffIds(
		existingArtistIds,
		incomingArtistIds,
	);

	const mutationResult = await applyArtistMutations(
		tracks,
		trackId,
		toAdd,
		toRemove,
	);

	if (!mutationResult.success) {
		return mutationResult;
	}

	const shouldReorder = toAdd.length > 0 || !isSame;

	if (shouldReorder) {
		const reorderResult = await tracks.reorderArtists(
			trackId,
			incomingArtistIds,
		);

		if (!reorderResult.success) {
			return {
				success: false,
				error: "Failed to reorder artists.",
			};
		}
	}

	return { success: true };
}

function isSameOrder(a: string[], b: string[]): boolean {
	return a.length === b.length && a.every((id, i) => id === b[i]);
}

function diffIds(existing: string[], incoming: string[]) {
	const existingSet = new Set(existing);
	const incomingSet = new Set(incoming);

	return {
		toAdd: incoming.filter((id) => !existingSet.has(id)),
		toRemove: existing.filter((id) => !incomingSet.has(id)),
	};
}

async function applyArtistMutations(
	tracks: TrackRepositoryContract,
	trackId: string,
	toAdd: string[],
	toRemove: string[],
): Promise<ActionResult> {
	const promises = [];

	if (toRemove.length) {
		promises.push(tracks.removeArtists(trackId, toRemove));
	}

	if (toAdd.length) {
		promises.push(tracks.addArtists(trackId, toAdd));
	}

	if (!promises.length) {
		return { success: true };
	}

	const results = await Promise.all(promises);

	if (results.some((r) => !r.success)) {
		return {
			success: false,
			error: "Failed to update track artists.",
		};
	}

	return { success: true };
}
