import Link from "next/link";
import { Container } from "@/components/layout/Container";
import ErrorState from "@/components/layout/ErrorState";
import { AlbumCard } from "@/features/music/albums/AlbumCard";
import { AlbumSearch } from "@/features/music/albums/AlbumSearch";
import EmptyAlbumState from "@/features/music/albums/EmptyAlbumState";
import { createRepositories } from "@/lib/factories/repository/server";

export default async function AlbumsPage({
	searchParams,
}: {
	searchParams?: Promise<{ query?: string }>;
}) {
	const { albums } = await createRepositories();

	const query = (await searchParams)?.query ?? "";
	const result = await albums.searchByTitle(query);

	if (!result.success) {
		return (
			<ErrorState
				message={result.error.message}
				code={result.error.code}
			/>
		);
	}

	const albumsList = result.data;

	if (albumsList.length === 0 && query === "") {
		return <EmptyAlbumState />;
	}

	return (
		<Container>
			<section className="py-6 animate-in fade-in duration-500">
				<header className="sticky flex flex-col justify-center items-center gap-4 pb-6">
					<h1 className="text-3xl font-bold tracking-tight">
						Albums
					</h1>

					<search className="w-1/4">
						<AlbumSearch />
					</search>
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
