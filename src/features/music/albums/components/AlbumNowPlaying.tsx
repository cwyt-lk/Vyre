import { Card } from "@/components/ui/Card";
import { Player } from "../../player/Player";

interface AlbumNowPlayingProps {
	currentTrack: { title: string; artist: string } | null;
}

export const AlbumNowPlaying = ({
	currentTrack,
}: AlbumNowPlayingProps) => {
	const title = currentTrack?.title ?? "No track selected";
	const artist = currentTrack?.artist ?? "—";

	return (
		<div className="grid gap-6">
			<Card className="bg-card/30 border-border/30 rounded-2xl p-4 gap-1">
				<p className="text-sm uppercase tracking-wide text-muted-foreground">
					Now playing
				</p>

				<p className="text-lg font-semibold truncate">{title}</p>

				<p className="text-sm text-muted-foreground truncate">
					By {artist}
				</p>
			</Card>

			<Player />
		</div>
	);
};
