import { SmartImage } from "@/components/ui/SmartImage";

interface AlbumCoverProps {
	coverUrl?: string;
	title: string;
}

export const AlbumCover = ({ coverUrl, title }: AlbumCoverProps) => {
	const src = coverUrl ?? "/placeholder.png";

	return (
		<figure className="relative size-64 shrink-0 overflow-hidden rounded-2xl lg:size-80">
			<SmartImage
				src={src}
				alt={`Cover art for ${title}`}
				fill
				sizes="(min-width: 1024px) 320px, 256px"
				className="object-cover"
			/>
		</figure>
	);
};
