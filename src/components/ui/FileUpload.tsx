"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, Upload } from "lucide-react";
import { type ReactNode, useCallback } from "react";
import { type DropzoneOptions, useDropzone } from "react-dropzone";
import { FilePreview } from "@/components/ui/FilePreview";
import { cn } from "@/lib/utils/cn";

const dropzoneVariants = cva(
	"relative flex flex-col items-center justify-center w-full min-h-[160px] p-6 border-2 border-dashed rounded-xl transition-all outline-none",
	{
		variants: {
			isDragActive: {
				true: "border-primary bg-primary/5 ring-2 ring-primary/20",
				false: "border-muted-foreground/25 hover:bg-muted/50",
			},
			disabled: {
				true: "opacity-50 cursor-not-allowed",
				false: "cursor-pointer",
			},
		},
		defaultVariants: { isDragActive: false, disabled: false },
	},
);

export interface FileUploadProps
	extends Omit<DropzoneOptions, "disabled">,
		VariantProps<typeof dropzoneVariants> {
	value?: File[];
	onValueChange?: (files: File[]) => void;
	disabled?: boolean;
	className?: string;
	invalid?: boolean;
	children?: ReactNode;
}

export function FileUpload({
	value = [],
	onValueChange,
	className,
	multiple,
	disabled = false,
	maxFiles,
	invalid,
	children,
	...props
}: FileUploadProps) {
	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const newFiles = multiple
				? [...value, ...acceptedFiles]
				: [acceptedFiles[0]];

			onValueChange?.(newFiles.slice(0, maxFiles ?? Infinity));
		},

		[value, onValueChange, multiple, maxFiles],
	);

	const { getRootProps, getInputProps, isDragActive, fileRejections } =
		useDropzone({
			onDrop,
			disabled,
			multiple,
			maxFiles,
			...props,
		});

	const handleRemove = (index: number) => {
		onValueChange?.(value.filter((_, i) => i !== index));
	};

	const hasFile = Boolean(value?.length) && Boolean(value[0]);
	const isSingle = !multiple;

	return (
		<div className={cn("flex gap-4 w-full", className)}>
			<div
				{...getRootProps()}
				className={cn(
					dropzoneVariants({ isDragActive, disabled }),
					invalid && "border-destructive bg-destructive/5",
				)}
			>
				<input {...getInputProps()} />

				{isSingle && hasFile ? (
					<div className="w-full p-2">
						<FilePreview
							file={value[0]}
							onRemove={(e) => {
								e.stopPropagation();
								onValueChange?.([]);
							}}
						/>
					</div>
				) : (
					<div className="flex flex-col items-center gap-3 text-center">
						<div className="p-3 rounded-full bg-muted">
							<Upload className="size-6 text-muted-foreground" />
						</div>

						<div className="text-sm font-semibold">
							{isDragActive ? (
								<p>Drop files here</p>
							) : (
								<>
									<p>Click or drag to upload</p>
									{children}
								</>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Error Messages */}
			{fileRejections.length > 0 && (
				<div className="space-y-1 px-1">
					{fileRejections.map(({ file, errors }) => (
						<div
							key={file.name}
							className="flex items-start gap-2 text-destructive text-sm font-medium"
						>
							<AlertCircle className="size-4" />
							<span>
								{file.name}:{" "}
								{errors
									.map((error) => error.message)
									.join(",")}
							</span>
						</div>
					))}
				</div>
			)}

			{/* Multiple Files List */}
			{multiple && value.length > 0 && (
				<div className="grid gap-2">
					{value.map((file, i) => (
						<FilePreview
							key={`${file.name}-${i}`}
							file={file}
							onRemove={() => handleRemove(i)}
						/>
					))}
				</div>
			)}
		</div>
	);
}
