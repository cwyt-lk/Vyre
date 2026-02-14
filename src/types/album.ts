import type { Track } from "@/types/track";

export interface Album {
    id: string;
    title: string;
    description: string | null;
    tracks: Track[];
    createdAt: Date;
}
