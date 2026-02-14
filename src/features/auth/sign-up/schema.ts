import { z } from "zod";

export const signUpSchema = z
	.object({
		email: z.email().nonempty("Email is required"),

		password: z
			.string()
			.min(8, "Password must be at least 8 characters.")
			.max(128, "Password must be at most 128 characters."),

		confirmPassword: z
			.string()
			.min(8, "Password must be at least 8 characters.")
			.max(128, "Password must be at most 128 characters."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signUpDefaultValues: SignUpInput = {
	email: "",
	password: "",
	confirmPassword: "",
};
