import Image from "next/image";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import type { AlbumWithCover } from "@/lib/mappers/domain";

interface AlbumCardProps {
	album: AlbumWithCover;
}

export const AlbumCard = async ({ album }: AlbumCardProps) => {
	return (
		<Card className="group h-full overflow-hidden border-none bg-muted/10 transition-all hover:bg-muted/50">
			<CardHeader className="p-4">
				<div className="relative aspect-square overflow-hidden rounded-xl">
					<Image
						src={album.coverUrl ?? "/placeholder.png"}
						alt={`${album.title} cover art`}
						fill
						priority
						className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
					/>
				</div>
			</CardHeader>

			<CardContent className="space-y-1 p-4 pt-0">
				<CardTitle className="line-clamp-1 text-lg font-bold tracking-tight">
					{album.title}
				</CardTitle>

				{album.description && (
					<CardDescription className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
						{album.description}
					</CardDescription>
				)}
			</CardContent>
		</Card>
	);
};
