import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { SmartImage } from "@/components/ui/SmartImage";
import type { AlbumWithCover } from "@/lib/mappers/domain";
import { formatDate } from "@/lib/utils/time";

interface AlbumCardProps {
	album: AlbumWithCover;
}

export const AlbumCard = async ({ album }: AlbumCardProps) => {
	return (
		<Card className="group relative flex h-full flex-col overflow-hidden bg-card/50 transition-all duration-300 hover:bg-card/90">
			<CardHeader className="shrink-0 overflow-hidden p-3">
				<div className="relative aspect-square overflow-hidden rounded-2xl">
					<SmartImage
						src={album.coverUrl ?? "/placeholder.png"}
						alt={`${album.title} cover art`}
						fill
						sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
						className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
					/>

					<div className="absolute inset-0 bg-linear-to-t from-background/50 via-background/10 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
				</div>
			</CardHeader>

			<CardContent className="flex flex-col gap-2 p-4 pt-0">
				<CardTitle className="line-clamp-2 text-base font-semibold leading-snug">
					{album.title}
				</CardTitle>

				<CardDescription className="line-clamp-1 text-xs capitalize tracking-wider text-muted-foreground/80">
					{formatDate(album.releaseDate)}
				</CardDescription>
			</CardContent>
		</Card>
	);
};
