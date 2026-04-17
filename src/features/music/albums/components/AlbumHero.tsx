import { Separator } from "@/components/ui/Separator";
import type { AlbumWithCover } from "@/lib/mappers/domain";
import { AlbumCover } from "./AlbumCover";
import { AlbumInfo } from "./AlbumInfo";
import { AlbumNowPlaying } from "./AlbumNowPlaying";

interface AlbumHeroProps {
	album: AlbumWithCover;
	currentTrack: { title: string; artist: string } | null;
}

export const AlbumHero = ({ album, currentTrack }: AlbumHeroProps) => {
	return (
		<section className="relative w-full overflow-hidden rounded-3xl">
			<div className="flex flex-col gap-8 px-6 py-8 lg:flex-row lg:px-8 lg:py-12">
				<AlbumCover
					coverUrl={album.coverUrl}
					title={album.title}
				/>

				<div className="flex w-full flex-col justify-between gap-6">
					<AlbumInfo album={album} />

					<Separator />

					<AlbumNowPlaying currentTrack={currentTrack} />
				</div>
			</div>
		</section>
	);
};
