import type { OperationResult } from "@/types/results";

export type ActionResult<T = void> = OperationResult<T, string>;
