import { VyreError } from "@/types/errors/vyre-error";

export class ReferenceViolationError extends VyreError {
	constructor(
		message = "This record is linked to other data and cannot be changed.",
	) {
		super(message, "REFERENCE_VIOLATION");
	}
}
