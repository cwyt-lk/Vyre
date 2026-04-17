"use client";

import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { AlbumHero } from "@/features/music/albums/components/AlbumHero";
import { AlbumTracksSection } from "@/features/music/albums/components/AlbumTracksSection";
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

	const queue = useMemo(
		() =>
			tracks.map(({ id, audioUrl, title, artists }) => ({
				id,
				src: audioUrl ?? "",
				title,
				artist: artists.map((a) => a.name).join(", "),
			})),
		[tracks],
	);

	useEffect(() => {
		setQueue(queue, album.id);
		return clearQueue;
	}, [album.id, queue, setQueue, clearQueue]);

	return (
		<section className="animate-in fade-in duration-500">
			<AlbumHero album={album} currentTrack={currentTrack} />
			<AlbumTracksSection tracks={tracks} />
		</section>
	);
};
