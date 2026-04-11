import Image from "next/image";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import type { AlbumWithCover } from "@/lib/mappers/domain";
import { placeholderSvg } from "@/lib/utils/placeholders";
import { formatDate } from "@/lib/utils/time";

interface AlbumCardProps {
	album: AlbumWithCover;
}

export const AlbumCard = async ({ album }: AlbumCardProps) => {
	return (
		<Card className="group overflow-hidden border-none bg-card/50 transition-all hover:bg-muted">
			<CardHeader className="p-4">
				<div className="relative aspect-square overflow-hidden rounded-xl">
					<Image
						src={album.coverUrl ?? "/placeholder.png"}
						alt={`${album.title} cover art`}
						fill
						sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
						priority
						placeholder="blur"
						blurDataURL={placeholderSvg}
						className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
					/>
				</div>
			</CardHeader>

			<CardContent className="space-y-1 p-4 pt-0">
				<CardTitle className="line-clamp-1 text-lg font-bold tracking-tight">
					{album.title}
				</CardTitle>

				<CardDescription className="text-sm leading-relaxed text-muted-foreground">
					{formatDate(album.releaseDate)}
				</CardDescription>
			</CardContent>
		</Card>
	);
};
