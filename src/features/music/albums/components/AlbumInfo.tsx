import type { AlbumWithCover } from "@/lib/mappers/domain";

interface AlbumInfoProps {
	album: AlbumWithCover;
}

export const AlbumInfo = ({ album }: AlbumInfoProps) => {
	const formattedDate = album.releaseDate.toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<div className="space-y-4">
			<header className="space-y-2">
				<p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
					Album
				</p>

				<h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
					{album.title}
				</h1>
			</header>

			<p className="max-w-xl text-sm leading-6 text-muted-foreground">
				Released {formattedDate}
			</p>
		</div>
	);
};
