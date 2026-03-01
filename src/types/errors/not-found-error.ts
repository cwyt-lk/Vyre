import { VyreError } from "@/types/errors/vyre-error";

export class NotFoundError extends VyreError {
	constructor(message = "This resource does not exist") {
		super(message, "NOT_FOUND");
	}
}
