"use client";

import { Lock, Mail } from "lucide-react";
import { FormInputField } from "@/components/form/FormInputField";
import { Field, FieldGroup, FieldSet } from "@/components/ui/Field";
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
		>
			<FieldGroup className="p-6">
				<SignInHeader />

				<FieldSet className="mt-6">
					<form.Field name="email">
						{(field) => (
							<FormInputField
								field={field}
								icon={<Mail className="size-5" />}
								placeholder="Enter your Email Address"
								type="email"
							/>
						)}
					</form.Field>

					<form.Field name="password">
						{(field) => (
							<FormInputField
								field={field}
								icon={<Lock className="size-5" />}
								placeholder="Enter your Password"
								type="password"
							/>
						)}
					</form.Field>
				</FieldSet>

				<SignInActions
					isSubmitting={isSubmitting}
					onReset={() => form.reset()}
				/>

				<div className="my-6 flex items-center gap-3">
					<div className="h-px flex-1 bg-border" />
					<span className="text-sm text-muted-foreground">
						OR
					</span>
					<div className="h-px flex-1 bg-border" />
				</div>

				<Field>
					<GoogleSocialButton />
					<GithubSocialButton />
				</Field>

				<SignInFooter />
			</FieldGroup>
		</form>
	);
}
