export type OperationResult<T = void, E = string> =
	| (T extends void ? { success: true } : { success: true; data: T })
	| { success: false; error: E };
