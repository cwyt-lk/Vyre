"use client";

import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { SmartImage } from "@/components/ui/SmartImage";
import { AlbumTrackList } from "@/features/music/albums/components/AlbumTrackList";
import { Player } from "@/features/music/player/Player";
import { useAudioPlayerStore } from "@/lib/audio/useAudioPlayerStore";
import type {
	AlbumWithCover,
	TrackAggregateWithAudio,
} from "@/lib/mappers/domain";

interface AlbumClientProps {
	album: AlbumWithCover;
	tracks: TrackAggregateWithAudio[];
}

export const AlbumClient = ({ album, tracks }: AlbumClientProps) => {
	const { currentTrack, setQueue, clearQueue } = useAudioPlayerStore(
		useShallow((s) => ({
			currentTrack: s.currentTrack,
			setQueue: s.setQueue,
			clearQueue: s.clearQueue,
		})),
	);

	const queue = useMemo(() => {
		return tracks.map((it) => {
			return {
				id: it.id,
				src: it.audioUrl ?? "",
				title: it.title,
				artist: it.artists.map((it) => it.name).join(", "),
			};
		});
	}, [tracks]);

	useEffect(() => {
		setQueue(queue, album.id);
		return () => clearQueue();
	}, [album.id, queue, setQueue, clearQueue]);

	return (
		<section className="space-y-8 py-10 animate-in fade-in duration-500">
			<header className="flex flex-col gap-8 md:flex-row">
				<div className="relative size-64 shrink-0 overflow-hidden rounded-xl">
					<SmartImage
						src={album.coverUrl ?? "/placeholder.png"}
						alt={`Cover art for ${album.title}`}
						fill
						sizes="256px"
						className="object-cover"
					/>
				</div>

				<div className="flex w-full flex-col justify-end gap-2">
					<p className="text-base uppercase tracking-wider text-muted-foreground">
						Album
					</p>

					<h1 className="w-3/4 pb-1 text-5xl font-bold tracking-tighter truncate">
						{album.title}
					</h1>

					<p className="w-2/3 text-xl text-muted-foreground line-clamp-2 text-ellipsis">
						<span className="font-medium">
							{currentTrack?.title}
						</span>

						<span> — {currentTrack?.artist}</span>
					</p>

					<time
						dateTime={album.releaseDate.toISOString()}
						className="text-sm text-muted-foreground"
					>
						{album.releaseDate.toLocaleDateString(undefined, {
							year: "numeric",
							month: "short",
							day: "numeric",
						})}
					</time>

					<div className="mt-3">
						<Player />
					</div>
				</div>
			</header>

			<section>
				<h2 className="mb-4 text-2xl font-semibold">Tracks</h2>

				<AlbumTrackList tracks={tracks} />
			</section>

			<footer className="text-sm text-muted-foreground">
				<p>Total Tracks: {tracks.length}</p>
			</footer>
		</section>
	);
};
