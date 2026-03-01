export class VyreError extends Error {
	readonly code: string;

	constructor(message: string, code: string) {
		super(message);
		this.code = code;
		this.name = this.constructor.name;

		Object.setPrototypeOf(this, new.target.prototype);
	}
}
