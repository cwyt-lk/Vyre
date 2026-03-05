/**
 * Fisher-Yates Shuffle Implementation
 * Time Complexity: O(n)
 * Space Complexity: O(1) (in-place)
 * @param array The array to shuffle
 */
export const shuffleArray = <T>(array: T[]): T[] => {
	const shuffled = [...array]; // Create a pure copy. To avoid mutation

	for (let i = shuffled.length - 1; i > 0; i--) {
		// Pick a random index from 0 to i
		const j = Math.floor(Math.random() * (i + 1));

		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	return shuffled;
};

/**
 * Helper for generating a shuffled order of indices.
 * @param length Length of indices
 * @param currentIndex This index will always appear at the top when provided.
 */
export const generateShuffleOrder = (
	length: number,
	currentIndex: number,
): number[] => {
	const allIndices = Array.from({ length }, (_, i) => i);
	if (currentIndex === -1) return shuffleArray(allIndices);

	const remaining = allIndices.filter((i) => i !== currentIndex);
	return [currentIndex, ...shuffleArray(remaining)];
};

/**
 * Maps each item in a list and flattens the result, excluding `null` values.
 *
 * This utility is useful when you want to transform a list while conditionally
 * omitting items. If the mapper returns `null`, that item is excluded from the
 * resulting array.
 *
 * @template TInput - The type of items in the input array.
 * @template TOutput - The type of items in the output array.
 *
 * @param items - The input array to map over. If `null` or `undefined`, an empty array is returned.
 * @param mapper - A function that transforms each item. Returning `null` will omit that item.
 *
 * @returns A new flattened array containing only the non-null mapped results.
 *
 * @example
 * ```ts
 * const nums = [1, 2, 3];
 * const result = flatMapList(nums, (n) => (n % 2 === 0 ? n * 2 : null));
 * // result: [4]
 * ```
 */
export function flatMapList<TInput, TOutput>(
	items: TInput[] | null,
	mapper: (v: TInput) => TOutput | null,
): TOutput[] {
	if (!items) return [];

	return items.flatMap((item) => {
		const val = mapper(item);
		return val ? [val] : [];
	});
}
