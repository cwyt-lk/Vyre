"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { TrackList } from "@/features/music/albums/TrackList";
import { Player } from "@/features/music/player/Player";
import { useAudioPlayerStore } from "@/lib/audio/useAudioPlayerStore";
import type { Album } from "@/types/domain/album";

interface AlbumClientProps {
	album: Album;
	coverUrl: string;
}

export function AlbumClient({ album, coverUrl }: AlbumClientProps) {
	const { currentTrack, setQueue, clearQueue } = useAudioPlayerStore(
		useShallow((s) => ({
			currentTrack: s.currentTrack,
			setQueue: s.setQueue,
			clearQueue: s.clearQueue,
		})),
	);

	useEffect(() => {
		setQueue(album.tracks, album.id);

		return () => {
			clearQueue();
		};
	}, [setQueue, album, clearQueue]);

	return (
		<section className="py-10 space-y-8 animate-in fade-in duration-500">
			<header className="flex flex-col md:flex-row gap-8">
				<div className="relative size-64 shrink-0 shadow-2xl">
					<Image
						src={coverUrl}
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
				<TrackList tracks={album.tracks} />
			</section>

			<footer className="text-sm text-muted-foreground">
				<p>Total Tracks: {album.tracks.length}</p>
			</footer>
		</section>
	);
}
