/**
 * Converts seconds to hh:mm:ss format
 * @param seconds Number of seconds
 * @returns formatted string like "01:03:45"
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

export function formatDate(date?: Date) {
	if (!date || isNaN(date.getTime())) return "";

	return date.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

export function parseDate(value: string) {
	const d = new Date(value);

	return isNaN(d.getTime()) ? undefined : d;
}
