import {
	Archive,
	Code2,
	FileAudio,
	FileBox,
	FileCode,
	FileImage,
	FileText,
	FileVideo,
} from "lucide-react";
import type { ElementType } from "react";

/**
 * Converts bytes to a human-readable string.
 */
export function getHumanSize(bytes: number): string {
	if (bytes <= 0) return "0 B";

	const units = ["B", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));

	const size = parseFloat((bytes / 1024 ** i).toFixed(2));

	return `${size} ${units[i]}`;
}

const CATEGORY_MAP: Record<string, ElementType> = {
	video: FileVideo,
	audio: FileAudio,
	image: FileImage,
	text: FileText,
	application: FileBox,
};

const SPECIFIC_MAP: Record<string, ElementType> = {
	"application/javascript": Code2,
	"application/typescript": Code2,
	"application/json": FileCode,
	"application/x-zip-compressed": Archive,
	"application/zip": Archive,
	"text/html": Code2,
};

/**
 * Returns the appropriate Lucide icon component based on the file's MIME type.
 */
export function getFileIconComponent(mimeType: string): ElementType {
	if (SPECIFIC_MAP[mimeType]) return SPECIFIC_MAP[mimeType];

	const [category] = mimeType.split("/");
	return CATEGORY_MAP[category] || FileText;
}
