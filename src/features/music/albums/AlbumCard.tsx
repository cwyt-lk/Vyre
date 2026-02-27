import Image from "next/image";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { createRepositories } from "@/lib/factories/server";
import type { Album } from "@/types/domain/album";

interface AlbumCardProps {
	album: Album;
}

export const AlbumCard = async ({ album }: AlbumCardProps) => {
	const { storage } = await createRepositories();

	const { data: coverUrl } = storage.getPublicFile(
		"cover-art",
		album.coverPath,
	);

	return (
		<Card className="overflow-hidden transition group">
			<CardContent className="flex justify-center">
				<Image
					src={coverUrl || "/placeholder.png"}
					alt={`${album.title} cover art`}
					width={256}
					height={256}
					placeholder="blur"
					blurDataURL="/placeholder.png"
					className="aspect-square object-cover rounded-3xl"
				/>
			</CardContent>

			<CardHeader className="space-y-2 text-center">
				<CardTitle className="text-xl font-semibold line-clamp-2 transition-all duration-200 group-hover:scale-105">
					{album.title}
				</CardTitle>

				{album.description && (
					<CardDescription className="line-clamp-2 text-sm text-muted-foreground transition-all duration-200 group-hover:scale-105">
						{album.description}
					</CardDescription>
				)}
			</CardHeader>
		</Card>
	);
};
