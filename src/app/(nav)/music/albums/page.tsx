import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ErrorState } from "@/components/layout/ErrorState";
import { SearchBar } from "@/components/ui/SearchBar";
import { AlbumCard } from "@/features/music/albums/components/AlbumCard";
import { EmptyAlbumState } from "@/features/music/albums/components/EmptyAlbumState";
import { PaginationClient } from "@/features/pagination/PaginationClient";
import { createRepositories } from "@/lib/factories/repository/server";
import { AlbumMapper, type AlbumWithCover } from "@/lib/mappers/domain";
import {
	getPagination,
	getPaginationTotalPages,
	type PaginationInput,
} from "@/lib/utils/pagination";

export default async function AlbumsPage({
	searchParams,
}: {
	searchParams?: Promise<{ query?: string } & PaginationInput>;
}) {
	const { albums, storage } = await createRepositories();
	const resolvedParams = await searchParams;

	if (!resolvedParams) {
		return <ErrorState />;
	}

	const { page, pageSize, from, to } = getPagination(resolvedParams);

	const result = await albums.searchByTitle(
		resolvedParams?.query ?? "",
		{
			range: [from, to],
		},
	);

	if (!result.success) {
		return (
			<ErrorState
				message={result.error.message}
				code={result.error.code}
			/>
		);
	}

	const { items, count } = result.data;
	const totalPages = getPaginationTotalPages(pageSize, count);

	const albumsList: AlbumWithCover[] = items.map((it) =>
		AlbumMapper.mapWithCover(it, storage),
	);

	if (albumsList.length === 0 && resolvedParams.query === "") {
		return <EmptyAlbumState />;
	}

	return (
		<Container>
			<section className="flex animate-in flex-col gap-8 py-8 duration-500 fade-in">
				<header className="flex flex-col gap-6">
					<div className="flex flex-col gap-2">
						<h1 className="text-4xl font-bold tracking-tight">
							Albums
						</h1>

						<p className="text-sm text-muted-foreground">
							Discover and explore your music library
						</p>
					</div>

					<search className="max-w-sm">
						<SearchBar placeholder="Search by title" />
					</search>
				</header>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{albumsList.map((album) => (
						<Link
							key={album.id}
							href={`/music/albums/${album.id}`}
							className="group rounded-xl
								transition-transform duration-500 ease-out hover:scale-[1.03]
								focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50
							"
						>
							<AlbumCard album={album} />
						</Link>
					))}
				</div>

				{albumsList.length > 0 && (
					<div className="pt-4">
						<PaginationClient
							currentPage={page}
							totalPages={totalPages}
						/>
					</div>
				)}
			</section>
		</Container>
	);
}
