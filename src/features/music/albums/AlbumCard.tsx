import Image from "next/image";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { createRepositories } from "@/lib/factories/repository/server";
import type { Album } from "@/types/domain";

interface AlbumCardProps {
	album: Album;
}

export const AlbumCard = async ({ album }: AlbumCardProps) => {
	const { storage } = await createRepositories();

	let imageSrc = "/placeholder.png";

	if (album.coverPath) {
		const result = storage.getPublicFile("cover-art", album.coverPath);

		if (result.success) {
			imageSrc = result.data;
		}
	}

	return (
		<Card className="group h-full overflow-hidden border-none bg-muted/10 transition-all hover:bg-muted/50">
			<CardHeader className="p-4">
				<div className="relative aspect-square overflow-hidden rounded-xl">
					<Image
						src={imageSrc}
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
