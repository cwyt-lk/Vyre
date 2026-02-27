import { Search } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/InputGroup";
import { AlbumCard } from "@/features/music/albums/AlbumCard";
import { createRepositories } from "@/lib/factories/server";

export default async function AlbumsPage() {
	const { albums } = await createRepositories();
	const { data: albumsList, error } = await albums.findAll();

	if (error || !albumsList || albumsList.length === 0) {
		return (
			<Container className="flex min-h-[50vh] flex-col items-center justify-center">
				TODO Add Empty & Error Screens
			</Container>
		);
	}

	return (
		<Container>
			<section className="py-6">
				<header className="flex flex-col justify-center items-center gap-4 pb-6">
					<h1 className="text-3xl font-bold tracking-tight">
						Albums
					</h1>

					<InputGroup className="max-w-xs">
						<InputGroupInput placeholder="Search..." />
						<InputGroupAddon>
							<Search />
						</InputGroupAddon>
						<InputGroupAddon align="inline-end">
							12 results
						</InputGroupAddon>
					</InputGroup>
				</header>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{albumsList.map((album) => (
						<Link
							key={album.id}
							href={`/music/albums/${album.id}`}
							className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
						>
							<AlbumCard album={album} />
						</Link>
					))}
				</div>
			</section>
		</Container>
	);
}
