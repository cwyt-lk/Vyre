import { VyreError } from "@/types/errors/vyre-error";

export class ConflictError extends VyreError {
	constructor(message = "This record already exists.") {
		super(message, "CONFLICT");
	}
}
