/**
 * Converts seconds to a formatted time string.
 *
 * - Returns "mm:ss" if hours = 0
 * - Returns "hh:mm:ss" if hours > 0
 *
 * @param seconds - Total number of seconds to format
 * @returns A formatted time string (e.g., "05:30", "01:03:45")
 */
export function formatTime(seconds: number): string {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	const minsStr = mins.toString().padStart(2, "0");
	const secsStr = secs.toString().padStart(2, "0");

	if (hrs > 0) {
		const hrsStr = hrs.toString().padStart(2, "0");
		return `${hrsStr}:${minsStr}:${secsStr}`;
	}

	return `${minsStr}:${secsStr}`;
}

/**
 * Formats a Date object into a human-readable string.
 *
 * Uses the "en-US" locale with long month format.
 *
 * @param date - The Date object to format
 * @returns A formatted date string (e.g., "March 26, 2026"), or an empty string if invalid
 */
export function formatDate(date?: Date): string {
	if (!date || Number.isNaN(date.getTime())) return "";

	return date.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

/**
 * Parses a string into a Date object.
 *
 * @param value - A date string compatible with the Date constructor
 * @returns A valid Date object, or undefined if parsing fails
 */
export function parseDate(value: string): Date | undefined {
	const d = new Date(value);

	return Number.isNaN(d.getTime()) ? undefined : d;
}
