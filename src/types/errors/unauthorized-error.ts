import { VyreError } from "@/types/errors/vyre-error";

export class UnauthorizedError extends VyreError {
	constructor(message = "You must be logged in to do that.") {
		super(message, "UNAUTHORIZED");
	}
}
