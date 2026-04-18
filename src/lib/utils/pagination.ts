/**
 * Input parameters for pagination from query strings or user input.
 * @property page - The page number as a string (will be parsed and validated).
 * @property pageSize - The number of items per page as a string (will be parsed and validated).
 */
export interface PaginationInput {
	page?: string;
	pageSize?: string;
}

/**
 * Calculated pagination details with boundaries for data fetching.
 * @property page - The validated page number (1-indexed).
 * @property pageSize - The validated number of items per page.
 * @property from - The starting index for data retrieval (0-indexed).
 * @property to - The ending index for data retrieval (0-indexed, inclusive).
 */
export interface PaginationResult {
	page: number;
	pageSize: number;
	from: number;
	to: number;
}

/**
 * Calculates pagination details (page number, boundaries) from input parameters.
 *
 * @param input - User-provided pagination parameters (typically from query strings).
 * @param defaults - Default values to use if parameters are missing or invalid.
 * @returns Validated pagination result with calculated boundaries.
 *
 * @example
 * const pagination = getPagination({ page: "2", pageSize: "20" });
 * // Returns: { page: 2, pageSize: 20, from: 20, to: 39 }
 */
export function getPagination(
	{ page, pageSize }: PaginationInput,
	defaults = { page: 1, pageSize: 10 },
): PaginationResult {
	const safePage = Math.max(Number(page) || defaults.page, 1);
	const safePageSize = Math.max(
		Number(pageSize) || defaults.pageSize,
		1,
	);

	const from = (safePage - 1) * safePageSize;
	const to = from + safePageSize - 1;

	return {
		page: safePage,
		pageSize: safePageSize,
		from,
		to,
	};
}

/**
 * Calculates the total number of pages needed for a dataset.
 *
 * @param pageSize - The number of items per page.
 * @param totalItems - The total number of items in the dataset.
 * @returns The total number of pages required (rounded up).
 *
 * @example
 * const pages = getPaginationTotalPages(20, 45);
 * // Returns: 3 (pages)
 */
export const getPaginationTotalPages = (
	pageSize: number,
	totalItems: number,
) => Math.ceil(totalItems / pageSize);
