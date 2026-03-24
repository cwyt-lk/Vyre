export interface PaginationInput {
	page?: string;
	pageSize?: string;
}

export interface PaginationResult {
	page: number;
	pageSize: number;
	from: number;
	to: number;
}

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
