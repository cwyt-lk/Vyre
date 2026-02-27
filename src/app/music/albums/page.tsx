import { Music } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { AlbumCard } from "@/features/music/albums/AlbumCard";
import { createRepositories } from "@/lib/factories/server";

export default async function AlbumsPage() {
	const { albums } = await createRepositories();
	const { data: albumsList, error } = await albums.findAll();

	if (!albumsList || albumsList?.length === 0) {
		return (
			<div className="fixed inset-0 flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Music size={64} className="text-primary" />

					<p className="text-base font-medium tracking-wide">
						No Albums Found
					</p>
				</div>
			</div>
		);
	}

	return (
		<Container>
			<section className="py-8">
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{albumsList.map((album) => (
						<Link
							key={album.id}
							href={`albums/${album.id}`}
						>
							<AlbumCard album={album} />
						</Link>
					))}
				</div>
			</section>
		</Container>
	);
}
