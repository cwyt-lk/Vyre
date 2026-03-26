/**
 * Extracts the username portion from an email address.
 *
 * @param email - The email address (e.g., "user@example.com")
 * @returns The part before the "@" symbol (e.g., "user")
 */
export function getNameFromEmail(email: string): string {
	return email.split("@")[0];
}

/**
 * Capitalizes the first character of a string.
 *
 * @param str - The input string
 * @returns The string with its first character uppercased
 */
export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalizes the first letter of each word in a string.
 *
 * Words are split by spaces.
 *
 * @param str - The input string (e.g., "hello world")
 * @returns The string with each word capitalized (e.g., "Hello World")
 */
export function capitalizeWords(str: string): string {
	return str.split(" ").map(capitalize).join(" ");
}

/**
 * Converts a string into a URL-friendly slug.
 *
 * - Lowercases the string
 * - Trims whitespace
 * - Replaces spaces with hyphens
 * - Removes non-word characters
 * - Collapses multiple hyphens into one
 *
 * @param text - The input text
 * @returns A slugified string (e.g., "Hello World!" → "hello-world")
 */
export function slugify(text: string): string {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/[^\w-]+/g, "") // Remove all non-word chars
		.replace(/--+/g, "-"); // Replace multiple - with single -
}
