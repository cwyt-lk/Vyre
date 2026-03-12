"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
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

		return () => {
			clearQueue();
		};
	}, [setQueue, album, clearQueue, queue]);

	return (
		<section className="py-10 space-y-8 animate-in fade-in duration-500">
			<header className="flex flex-col md:flex-row gap-8">
				<div className="relative size-64 shrink-0 shadow-2xl">
					<Image
						src={album.coverUrl ?? "/placeholder.png"}
						alt={`Cover art for ${album.title}`}
						fill
						priority
						className="object-cover rounded-xl"
					/>
				</div>

				<div className="flex flex-col gap-4 w-full">
					<div>
						<span className="text-sm uppercase tracking-wider text-muted-foreground">
							Album
						</span>

						<h1 className="text-5xl font-bold tracking-tighter">
							{album.title}
						</h1>

						<h2 className="text-2xl text-muted-foreground font-medium">
							{currentTrack?.title ?? ""}
						</h2>
					</div>

					<div className="pt-4">
						<Player />
					</div>
				</div>
			</header>

			<section>
				<h2 className="text-2xl font-semibold mb-4">Tracks</h2>
				<AlbumTrackList tracks={tracks} />
			</section>

			<footer className="text-sm text-muted-foreground">
				<p>Total Tracks: {tracks.length}</p>
			</footer>
		</section>
	);
};
