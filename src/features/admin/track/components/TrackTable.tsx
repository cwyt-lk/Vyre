"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ItemGroup } from "@/components/ui/Item";
import { AdminItemRow } from "@/features/admin/components/AdminItemRow";
import { deleteTrackAction } from "@/features/admin/track/actions/deleteTrack";
import type { TrackAggregate } from "@/types/domain";

interface TrackTableProps {
	trackList: TrackAggregate[];
}

export const TrackTable = ({ trackList }: TrackTableProps) => {
	const [tracks, setTracks] = useState(trackList);

	const onDelete = async (id: string) => {
		const res = await deleteTrackAction(id);

		if (!res.success) {
			toast.error(res.error);
			return;
		}

		setTracks((prev) => prev.filter((it) => it.id !== id));

		toast.success("Successfully Deleted");
	};

	return (
		<ItemGroup>
			{tracks.map((track) => (
				<AdminItemRow
					key={track.id}
					id={track.id}
					title={track.title}
					description={`${track.genre?.label} - ${track.artists.map((it) => it.name).join(", ")}`}
					onDelete={onDelete}
					editHref={`/admin/tracks/update/${track.id}`}
				/>
			))}
		</ItemGroup>
	);
};
