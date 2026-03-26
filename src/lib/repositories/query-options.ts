/** biome-ignore-all lint/suspicious/noExplicitAny: Using `any` here intentionally to allow full generic type inference for Supabase queries. */

/**
 * Options for fetching records with pagination and ordering capabilities.
 */
export interface QueryOptions {
	/**
	 * Optional range for pagination: [start, end] indices.
	 * Used to limit the number of records returned.
	 */
	range?: [number, number];
	/**
	 * Optional ordering configuration for sorting results.
	 */
	order?: {
		/** The field name to sort by. */
		field: string;
		/** The sort direction: "asc" for ascending, "desc" for descending. */
		direction: "asc" | "desc";
	};
}

/**
 * A Mirror Typing of Supabase Query Builder Methods that we need.
 */
interface QueryOptionsMethods<T> {
	/**
	 * Apply range pagination to the query.
	 * @param from - The starting index (inclusive).
	 * @param to - The ending index (inclusive).
	 * @returns The query builder instance for chaining.
	 */
	range: (from: number, to: number) => T;
	/**
	 * Apply ordering to the query.
	 * @param column - The column name to order by.
	 * @param options - Ordering options including ascending direction.
	 * @returns The query builder instance for chaining.
	 */
	order: (column: any, options: { ascending: boolean }) => T;
}

/**
 * A shared utility to apply range and order options to a Supabase query.
 * This function conditionally applies pagination and sorting based on provided options.
 *
 * @template T - The query builder type that implements QueryOptionsMethods.
 * @param query - The Supabase query builder instance.
 * @param options - Optional QueryOptions containing range and order configuration.
 * @returns The enhanced query builder with applied options, or the original query if no options provided.
 *
 * @example
 * ```ts
 * const query = supabase.from('tracks').select('*');
 * const enhanced = applyQueryOptions(query, {
 *   range: [0, 19],
 *   order: { field: 'title', direction: 'asc' }
 * });
 * ```
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
