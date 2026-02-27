export function getNameFromEmail(email: string) {
	return email.split("@")[0];
}

export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
