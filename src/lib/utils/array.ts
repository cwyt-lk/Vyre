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
