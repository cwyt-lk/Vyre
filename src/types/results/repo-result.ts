import type { VyreError } from "@/types/errors";
import type { OperationResult } from "@/types/results";

export type RepoResult<T = void> = OperationResult<T, VyreError>;

export type ListResult<T> = {
	data: T[];
	count: number;
};

export type RepoListResult<T> = RepoResult<ListResult<T>>;
