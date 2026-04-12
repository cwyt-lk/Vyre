"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, Upload, X } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useMemo } from "react";
import { type DropzoneOptions, useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/Button";
import { FilePreview } from "@/components/ui/FilePreview";
import { cn } from "@/lib/utils/cn";
import { getHumanSize } from "@/lib/utils/file";

/* -----------------------------------------------------------------------------
 * Styles
 * -------------------------------------------------------------------------- */

const dropzoneStyles = cva(
	"flex flex-col justify-center items-center w-full rounded-xl border-2 border-dashed min-h-[160px] p-6 transition-all outline-none",
	{
		variants: {
			isActive: {
				true: "border-primary bg-primary/5 ring-2 ring-primary/20",
				false: "border-muted-foreground/25 hover:bg-muted/50",
			},
			disabled: {
				true: "cursor-not-allowed opacity-50",
				false: "cursor-pointer",
			},
		},
		defaultVariants: {
			isActive: false,
			disabled: false,
		},
	},
);

/* -----------------------------------------------------------------------------
 * Types
 * -------------------------------------------------------------------------- */

export interface FileUploadProps
	extends Omit<DropzoneOptions, "disabled">,
		VariantProps<typeof dropzoneStyles> {
	value?: File[];
	onValueChange?: (files: File[]) => void;
	disabled?: boolean;
	invalid?: boolean;
	className?: string;
	children?: ReactNode;
}

/* -----------------------------------------------------------------------------
 * Component
 * -------------------------------------------------------------------------- */

export function FileUpload({
	value = [],
	onValueChange,
	className,
	multiple,
	disabled = false,
	maxFiles,
	invalid,
	children,
	accept,
	maxSize,
	...props
}: FileUploadProps) {
	const files = useMemo(
		() => value.filter((file): file is File => Boolean(file)),
		[value],
	);

	const isSingle = !multiple;
	const hasFiles = files.length > 0;
	const singleFile = files[0];

	/* -----------------------------------------------------------------------------
	 * Derived values
	 * -------------------------------------------------------------------------- */

	const acceptedTypes = useMemo(() => {
		if (!accept) return null;

		return Object.entries(accept)
			.map(([type, extensions]) =>
				extensions?.length
					? `${type} (${extensions.join(", ")})`
					: type,
			)
			.join(", ");
	}, [accept]);

	/* -----------------------------------------------------------------------------
	 * Handlers
	 * -------------------------------------------------------------------------- */

	const updateFiles = useCallback(
		(next: File[]) => {
			onValueChange?.(next.slice(0, maxFiles ?? Infinity));
		},
		[onValueChange, maxFiles],
	);

	const handleDrop = useCallback(
		(incoming: File[]) => {
			if (!incoming.length) return;

			updateFiles(
				multiple ? [...files, ...incoming] : [incoming[0]],
			);
		},
		[files, multiple, updateFiles],
	);

	const removeAtIndex = useCallback(
		(index: number) => {
			onValueChange?.(files.filter((_, i) => i !== index));
		},
		[files, onValueChange],
	);

	const clearAll = useCallback(() => {
		onValueChange?.([]);
	}, [onValueChange]);

	/* -----------------------------------------------------------------------------
	 * Dropzone
	 * -------------------------------------------------------------------------- */

	const { getRootProps, getInputProps, isDragActive, fileRejections } =
		useDropzone({
			onDrop: handleDrop,
			disabled,
			multiple,
			maxFiles,
			accept,
			maxSize,
			...props,
		});

	/* -----------------------------------------------------------------------------
	 * Paste support
	 * -------------------------------------------------------------------------- */

	useEffect(() => {
		if (disabled) return;

		const onPaste = (event: ClipboardEvent) => {
			const items = event.clipboardData?.items;

			if (!items) return;

			const pastedFiles: File[] = [];

			for (const item of items) {
				if (item.kind === "file") {
					const file = item.getAsFile();

					if (file) pastedFiles.push(file);
				}
			}

			if (pastedFiles.length) {
				event.preventDefault();

				handleDrop(pastedFiles);
			}
		};

		document.addEventListener("paste", onPaste);

		return () => document.removeEventListener("paste", onPaste);
	}, [disabled, handleDrop]);

	/* -----------------------------------------------------------------------------
	 * UI blocks
	 * -------------------------------------------------------------------------- */

	const EmptyState = () => (
		<div className="flex flex-col items-center gap-3 text-center">
			<div className="rounded-full bg-muted p-3">
				<Upload className="size-6 text-muted-foreground" />
			</div>

			<div className="space-y-1 text-sm font-semibold">
				{isDragActive ? (
					<p>Drop files here</p>
				) : (
					<>
						<p>Click, Drag, or Paste files</p>

						{children}

						{acceptedTypes && (
							<p className="text-xs text-muted-foreground">
								Accepted: {acceptedTypes}
							</p>
						)}

						{maxSize && (
							<p className="text-xs text-muted-foreground">
								Max size: {getHumanSize(maxSize)}
							</p>
						)}
					</>
				)}
			</div>
		</div>
	);

	const SinglePreview = () =>
		singleFile ? (
			<FilePreview
				file={singleFile}
				onRemove={(e) => {
					e.stopPropagation();
					onValueChange?.([]);
				}}
			/>
		) : null;

	const Errors = () =>
		fileRejections.length > 0 ? (
			<div className="space-y-1 px-1">
				{fileRejections.map(({ file, errors }) => (
					<div
						key={file.name}
						className="flex items-start gap-2 text-sm font-medium text-destructive"
					>
						<AlertCircle className="size-4" />
						<span>
							{file.name}:{" "}
							{errors.map((e) => e.message).join(", ")}
						</span>
					</div>
				))}
			</div>
		) : null;

	const FileList = () =>
		multiple && hasFiles ? (
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium">
						{files.length} file{files.length !== 1 && "s"}{" "}
						selected
					</span>

					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={clearAll}
						className="h-8"
					>
						<X className="mr-1 size-4" />
						Clear
					</Button>
				</div>

				<div className="grid gap-2">
					{files.map((file, i) => (
						<div
							key={`${file.name}-${i}`}
							className="relative transition-all duration-200"
						>
							<FilePreview
								file={file}
								onRemove={() => removeAtIndex(i)}
							/>
						</div>
					))}
				</div>
			</div>
		) : null;

	/* -----------------------------------------------------------------------------
	 * Render
	 * -------------------------------------------------------------------------- */

	return (
		<div className={cn("flex flex-col gap-4", className)}>
			<div
				{...getRootProps()}
				className={cn(
					dropzoneStyles({
						isActive: isDragActive,
						disabled,
					}),
					invalid && "border-destructive bg-destructive/5",
				)}
			>
				<input {...getInputProps()} />

				{!hasFiles && <EmptyState />}
				{isSingle && hasFiles && <SinglePreview />}
			</div>

			<Errors />
			<FileList />
		</div>
	);
}
