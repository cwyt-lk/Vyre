/** biome-ignore-all lint/suspicious/noExplicitAny: Using `any` here intentionally to allow full generic type inference for Supabase queries. */

/** Options for fetching records */
export interface QueryOptions {
	/** Optional range: [start, end] for pagination */
	range?: [number, number];
	/** Optional ordering: e.g., "asc" or "desc" on a given field */
	order?: {
		field: string;
		direction: "asc" | "desc";
	};
}

/**
 * A Mirror Typing of Supabase Query Builder Methods that we need.
 */
interface QueryOptionsMethods<T> {
	range: (from: number, to: number) => T;
	order: (column: any, options: { ascending: boolean }) => T;
}

/**
 * A shared utility to apply range and order.
 */
export function applyQueryOptions<T extends QueryOptionsMethods<T>>(
	query: T,
	options?: QueryOptions,
): T {
	if (!options) return query;

	let enhancedQuery = query;

	if (options.range) {
		enhancedQuery = enhancedQuery.range(
			options.range[0],
			options.range[1],
		);
	}

	if (options.order) {
		enhancedQuery = enhancedQuery.order(options.order.field, {
			ascending: options.order.direction === "asc",
		});
	}

	return enhancedQuery;
}
