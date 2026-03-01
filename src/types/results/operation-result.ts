export type OperationResult<T, E> = T extends void
	? { success: true } | { success: false; error: E }
	: { success: true; data: T } | { success: false; error: E };
