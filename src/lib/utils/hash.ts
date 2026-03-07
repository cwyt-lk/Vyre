import { createSHA256, type IHasher } from "hash-wasm";

/**
 * Hash a File using streaming, suitable for large files.
 *
 * @param {File} file - The file to hash.
 * @param {string} [algorithm="sha256"] - The hashing algorithm to use. Currently only "sha256" is supported.
 * @returns {Promise<string>} The hexadecimal string representation of the file's hash.
 * @throws {Error} Throws if an unsupported algorithm is provided.
 */
export async function hashFile(
	file: File,
	algorithm = "sha256",
): Promise<string> {
	let hasher: IHasher;

	switch (algorithm) {
		case "sha256":
			hasher = await createSHA256();
			break;
		default:
			throw new Error(`Unsupported algorithm: ${algorithm}`);
	}

	const reader = file.stream().getReader();

	while (true) {
		const { done, value } = await reader.read();

		if (done) break;

		hasher.update(value);
	}

	return hasher.digest("hex");
}

/**
 * Generate a hashed path for a File, using the file's SHA-256 hash.
 * The path format is `{first_two_hash_chars}/{full_hash}.{file_extension}`.
 *
 * @param {File} file - The file for which to generate the hashed path.
 * @returns {Promise<string>} A string representing the hashed path for the file.
 */
export async function getHashedPath(file: File): Promise<string> {
	const ext = file.name.split(".").pop() ?? "";
	const hash = await hashFile(file);
	const folder = hash.slice(0, 2);

	return `${folder}/${hash}.${ext}`;
}
