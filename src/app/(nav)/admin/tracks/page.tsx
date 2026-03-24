import { ErrorState } from "@/components/layout/ErrorState";
import { TrackTable } from "@/features/admin/track/components/TrackTable";
import { EmptyAlbumState } from "@/features/music/albums/components/EmptyAlbumState";
import { createRepositories } from "@/lib/factories/repository/server";

export default async function AdminTracksPage() {
	const { tracks } = await createRepositories();
	const res = await tracks.findAllWithRelations({
		order: {
			field: "title",
			direction: "asc",
		},
	});

	if (!res.success) {
		return <ErrorState />;
	}

	if (!res.data || res.data.length === 0) {
		return <EmptyAlbumState />;
	}

	return (
		<div className="min-h-screen p-6">
			<h1 className="text-3xl font-bold mb-6">Albums</h1>

			<TrackTable trackList={res.data} />
		</div>
	);
}
