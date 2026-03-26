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

	const res = await albums.searchByTitle(resolvedParams?.query ?? "", {
		range: [from, to],
	});

	if (!res.success) {
		return (
			<ErrorState
				message={res.error.message}
				code={res.error.code}
			/>
		);
	}

	const { data, count } = res.data;
	const totalPages = getPaginationTotalPages(pageSize, count);

	const albumsList: AlbumWithCover[] = data.map((it) =>
		AlbumMapper.mapWithCover(it, storage),
	);

	if (albumsList.length === 0 && resolvedParams.query === "") {
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
						<SearchBar placeholder="Search by title" />
					</search>
				</header>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

				<div className="mt-6">
					<PaginationClient
						currentPage={page}
						totalPages={totalPages}
					/>
				</div>
			</section>
		</Container>
	);
}
