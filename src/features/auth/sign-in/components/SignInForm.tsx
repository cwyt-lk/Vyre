"use client";

import { Lock, Mail } from "lucide-react";
import { FormInputField } from "@/components/form/FormInputField";
import { FieldGroup, FieldSet } from "@/components/ui/Field";
import { Separator } from "@/components/ui/Separator";
import { SignInActions } from "@/features/auth/sign-in/components/SignInActions";
import { SignInFooter } from "@/features/auth/sign-in/components/SignInFooter";
import { SignInHeader } from "@/features/auth/sign-in/components/SignInHeader";
import { useSignInForm } from "@/features/auth/sign-in/hooks/useSignInForm";
import {
	GithubSocialButton,
	GoogleSocialButton,
} from "@/features/auth/social-auth";

export function SignInForm() {
	const { form, isSubmitting } = useSignInForm();

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="w-full"
		>
			<FieldGroup className="p-4">
				<SignInHeader />

				<FieldSet className="mt-8 space-y-4">
					<form.Field name="email">
						{(field) => (
							<FormInputField
								field={field}
								icon={
									<Mail className="size-4 opacity-70" />
								}
								placeholder="name@example.com"
								type="email"
							/>
						)}
					</form.Field>

					<form.Field name="password">
						{(field) => (
							<FormInputField
								field={field}
								icon={
									<Lock className="size-4 opacity-70" />
								}
								placeholder="Enter your password"
								type="password"
							/>
						)}
					</form.Field>
				</FieldSet>

				<SignInActions
					isSubmitting={isSubmitting}
					onReset={() => form.reset()}
				/>

				<div className="relative my-4">
					<div className="absolute inset-0 flex items-center">
						<Separator />
					</div>

					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-card px-2 text-muted-foreground">
							Or continue with
						</span>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<GoogleSocialButton />
					<GithubSocialButton />
				</div>

				<SignInFooter className="my-4" />
			</FieldGroup>
		</form>
	);
}
