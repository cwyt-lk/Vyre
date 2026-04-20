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
		<div className="flex flex-col gap-3">
			<header className="flex flex-col gap-2">
				<p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
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
