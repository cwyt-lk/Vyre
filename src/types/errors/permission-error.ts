import { VyreError } from "@/types/errors/vyre-error";

export class PermissionError extends VyreError {
	constructor(
		message = "You do not have permission to perform this action.",
	) {
		super(message, "FORBIDDEN");
	}
}
