"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
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

	useEffect(() => {
		setTracks(trackList);
	}, [trackList]);

	const { execute, isExecuting } = useAction(deleteTrackAction, {
		onSuccess: ({ input, data }) => {
			if (!data?.success) {
				toast.error(data?.error);
				return;
			}

			setTracks((prev) => prev.filter((it) => it.id !== input.id));

			toast.success("Successfully Deleted");
		},

		onError: () => {
			toast.error("Something went wrong. Please try again.");
		},
	});

	const onDelete = (id: string) => {
		execute({ id });
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
