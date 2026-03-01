import { createRepositories } from "@/lib/factories/repository/client";
import type { Track } from "@/types/domain";

export function getTrackUrl(track: Track): string | null {
	const { storage } = createRepositories();

	if (!track?.filePath) return null;

	const { data, error } = storage.getPublicFile("music", track.filePath);

	if (error) {
		console.error("Failed to get track URL", error);
		return null;
	}

	return data;
}
