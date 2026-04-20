import type { VyreError } from "@/types/errors";
import type { RepoListResult } from "@/types/results";
import type { QueryOptions } from "../repositories";
import type { PaginationInput } from "./pagination";
import { getPagination, getPaginationTotalPages } from "./pagination";

/**
 * A search/query function that returns paginated results.
 *
 * @template T - The type of items returned by the search function.
 * @param query - Optional search query string.
 * @param options - Query options including pagination range.
 * @returns A promise resolving to a RepoListResult containing items and total count.
 */
type SearchFn<T> = (
	query: string,
	options?: QueryOptions,
) => Promise<RepoListResult<T>>;

/**
 * Options for executing a paginated search.
 *
 * @template T - The type of items being searched.
 * @property params - Pagination parameters (page and pageSize).
 * @property searchFn - The search function to execute with pagination range.
 * @property query - Optional search query string to pass to the search function.
 * @property queryOptions - Additional query options (excluding range, which is calculated).
 */
type PaginatedSearchOptions<T> = {
	params: PaginationInput;
	searchFn: SearchFn<T>;
	query?: string;
	queryOptions?: Omit<QueryOptions, "range">;
};

/**
 * Result of a paginated search operation.
 *
 * @template T - The type of items in the results.
 * @property success - Whether the search was successful.
 * @property items - The retrieved items for the current page.
 * @property count - The total number of items across all pages.
 * @property page - The current page number.
 * @property totalPages - The total number of pages available.
 * @property error - Error object if the search failed (only present when success is false).
 */
type PaginatedSearchResult<T> =
	| {
			success: true;
			items: T[];
			count: number;
			page: number;
			totalPages: number;
	  }
	| {
			success: false;
			error: VyreError;
	  };

/**
 * Executes a search function with automatic pagination handling.
 *
 * Calculates pagination boundaries from the provided parameters, executes the search
 * function with the calculated range, and enriches the result with pagination metadata.
 *
 * @template T - The type of items being searched.
 * @param options - Configuration object containing search parameters and function.
 * @returns A promise resolving to a paginated search result with items and pagination info.
 *
 * @example
 * const result = await paginatedSearch({
 *   params: { page: "1", pageSize: "20" },
 *   searchFn: (query, options) => searchDatabase(query, options),
 *   query: "typescript",
 *   queryOptions: { sortBy: "date" }
 * });
 *
 * if (result.success) {
 *   console.log(`Showing page ${result.page} of ${result.totalPages}`);
 *   console.log(`Total items: ${result.count}`);
 * }
 */
export async function paginatedSearch<T>({
	params,
	searchFn,
	query,
	queryOptions,
}: PaginatedSearchOptions<T>): Promise<PaginatedSearchResult<T>> {
	const { page, pageSize, from, to } = getPagination(params);

	const res = await searchFn(query ?? "", {
		...queryOptions,
		range: [from, to],
	});

	if (!res.success) {
		return { success: false as const, error: res.error };
	}

	const { items, count } = res.data;
	const totalPages = getPaginationTotalPages(pageSize, count);

	return {
		success: true as const,
		items,
		count,
		page,
		totalPages,
	};
}
