import { z } from 'zod';

export const signInSchema = z.object({
    email: z.email().nonempty("Email is required"),
    password: z.string().nonempty("Password is required"),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const signInDefaultValues: SignInInput = {
    email: "",
    password: "",
};
