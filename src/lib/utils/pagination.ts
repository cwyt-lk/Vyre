/**
 * Input parameters for pagination.
 */
export interface PaginationInput {
	page?: string;
	pageSize?: string;
}

/**
 * Result object containing pagination details.
 */
export interface PaginationResult {
	page: number;
	pageSize: number;
	from: number;
	to: number;
}

/**
 * Calculates pagination details based on input and defaults.
 * @param input - The pagination input parameters.
 * @param defaults - Default values for page and pageSize.
 * @returns The pagination result object.
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
 * Calculates the total number of pages based on page size and total items.
 * @param pageSize - The number of items per page.
 * @param totalItems - The total number of items.
 * @returns The total number of pages.
 */
export const getPaginationTotalPages = (
	pageSize: number,
	totalItems: number,
) => Math.ceil(totalItems / pageSize);
