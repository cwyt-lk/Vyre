import type { VyreError } from "@/types/errors";
import type { OperationResult } from "@/types/results";

export type RepoResult<T = void> = OperationResult<T, VyreError>;
