import { createRepositories } from "@/lib/factories/repository/client";
import type { Track } from "@/types/domain";

export function getTrackUrl(track: Track): string | null {
	const { storage } = createRepositories();

	if (!track.audioUrl) return null;

	const result = storage.getPublicFile("music", track.audioUrl);

	if (!result.success) {
		console.error("Failed to get track URL", result.error.message);

		return null;
	}

	return result.data;
}
