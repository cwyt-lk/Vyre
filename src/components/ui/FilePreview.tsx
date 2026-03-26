"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import Image from "next/image";
import { type MouseEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import { getFileIconComponent, getHumanSize } from "@/lib/utils/file";
import { placeholderSvg } from "@/lib/utils/placeholders";

const filePreviewVariants = cva(
	"relative overflow-hidden transition-all duration-200",
	{
		variants: {
			layout: {
				single: "w-full border-none bg-transparent shadow-none",
				list: "w-full border-muted hover:shadow-md bg-card",
			},
		},
		defaultVariants: { layout: "list" },
	},
);

interface FilePreviewProps
	extends VariantProps<typeof filePreviewVariants> {
	file: File;
	onRemove: (e: MouseEvent) => void;
}

export function FilePreview({ file, onRemove, layout }: FilePreviewProps) {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const isImage = file.type.startsWith("image/");

	useEffect(() => {
		if (!isImage) return;

		const url = URL.createObjectURL(file);
		setPreviewUrl(url);

		return () => URL.revokeObjectURL(url);
	}, [file, isImage]);

	const Icon = getFileIconComponent(file.type);

	return (
		<Card className={cn(filePreviewVariants({ layout }))}>
			<CardContent
				className={cn("p-3", layout === "single" && "px-0")}
			>
				<div className="flex items-center gap-4">
					<div
						className={cn(
							"relative shrink-0 overflow-hidden rounded-md border bg-muted flex items-center justify-center",
							layout === "single" ? "size-16" : "size-12",
						)}
					>
						{isImage && previewUrl ? (
							<Image
								src={previewUrl}
								alt={file.name}
								fill
								placeholder="blur"
								blurDataURL={placeholderSvg}
								className="object-cover"
							/>
						) : (
							<div className="text-muted-foreground">
								<Icon className="size-5" />
							</div>
						)}
					</div>

					<div className="flex flex-col gap-1 flex-1 min-w-0">
						<span className="text-sm font-medium">
							{file.name}
						</span>

						<span className="text-xs text-muted-foreground">
							{getHumanSize(file.size)}
						</span>
					</div>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-8 shrink-0 rounded-full hover:bg-destructive hover:text-destructive-foreground"
						onClick={onRemove}
					>
						<X className="size-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
