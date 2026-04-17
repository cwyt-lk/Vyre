import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { AlbumTrackList } from "@/features/music/albums/components/AlbumTrackList";
import type { TrackAggregateWithAudio } from "@/lib/mappers/domain";

interface AlbumTracksSectionProps {
	tracks: TrackAggregateWithAudio[];
}

export const AlbumTracksSection = ({
	tracks,
}: AlbumTracksSectionProps) => {
	const trackCount = tracks.length;
	const trackLabel = trackCount === 1 ? "track" : "tracks";

	if (trackCount === 0) return;

	return (
		<Card className="rounded-3xl border border-border/20 bg-card/30">
			<CardHeader className="flex flex-col gap-4 border-b border-border/50 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1">
					<CardTitle className="text-2xl font-semibold">
						Track list
					</CardTitle>

					<p className="text-sm text-muted-foreground">
						Tap a track to jump straight into playback.
					</p>
				</div>

				<div className="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-sm font-medium text-muted-foreground">
					{trackCount} {trackLabel}
				</div>
			</CardHeader>

			<CardContent className="px-6 py-6">
				<AlbumTrackList tracks={tracks} />
			</CardContent>
		</Card>
	);
};
