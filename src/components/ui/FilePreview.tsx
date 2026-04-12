"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { type MouseEvent, useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import { getFileIconComponent, getHumanSize } from "@/lib/utils/file";

import { Button } from "./Button";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "./Item";
import { SmartImage } from "./SmartImage";

const filePreviewVariants = cva("relative transition-all duration-200", {
	variants: {
		layout: {
			single: "border-none bg-transparent shadow-none",
			list: "border-muted hover:shadow-md bg-card",
		},
	},
	defaultVariants: {
		layout: "list",
	},
});

interface FilePreviewProps
	extends VariantProps<typeof filePreviewVariants> {
	file: File;
	onRemove: (e: MouseEvent) => void;
}

export function FilePreview({ file, onRemove, layout }: FilePreviewProps) {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const isImage = file.type.startsWith("image/");
	const fileExtension =
		file.name.split(".").pop()?.toUpperCase() ?? "FILE";

	const Icon = getFileIconComponent(file.type);

	useEffect(() => {
		if (!isImage) return;

		const url = URL.createObjectURL(file);
		setPreviewUrl(url);

		return () => URL.revokeObjectURL(url);
	}, [file, isImage]);

	return (
		<Card className={cn(filePreviewVariants({ layout }))}>
			<CardContent
				className={cn("p-2", layout === "single" && "px-0")}
			>
				<Item>
					<ItemMedia
						variant={isImage ? "image" : "icon"}
						className="size-12"
					>
						{isImage && previewUrl ? (
							<SmartImage
								src={previewUrl}
								alt={file.name}
								fill
								sizes="(max-width: 640px) 48px, 64px"
								className="object-cover"
							/>
						) : (
							<div className="text-muted-foreground">
								<Icon className="size-5" />
							</div>
						)}
					</ItemMedia>

					<ItemContent>
						<ItemTitle>
							<p className="max-w-50 truncate">
								{file.name}
							</p>
						</ItemTitle>
						<ItemDescription>
							{getHumanSize(file.size)} • {fileExtension}
						</ItemDescription>
					</ItemContent>

					<ItemActions>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="size-8 shrink-0 rounded-full hover:bg-destructive hover:text-destructive-foreground"
							onClick={onRemove}
							aria-label={`Remove ${file.name}`}
						>
							<X className="size-4" />
						</Button>
					</ItemActions>
				</Item>
			</CardContent>
		</Card>
	);
}
