"use client";

import { Lock, Mail, User } from "lucide-react";
import { FormInputField } from "@/components/form/FormInputField";
import { Field, FieldGroup, FieldSet } from "@/components/ui/Field";
import { SignUpActions } from "@/features/auth/sign-up/components/SignUpActions";
import { SignUpFooter } from "@/features/auth/sign-up/components/SignUpFooter";
import { SignUpHeader } from "@/features/auth/sign-up/components/SignUpHeader";
import { useSignUpForm } from "@/features/auth/sign-up/hooks/useSignUpForm";
import {
	GithubSocialButton,
	GoogleSocialButton,
} from "@/features/auth/social-auth";

export function SignUpForm() {
	const { form, isSubmitting } = useSignUpForm();

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<FieldGroup className="p-6">
				<SignUpHeader />

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

					<form.Field name="confirmPassword">
						{(field) => (
							<FormInputField
								field={field}
								icon={<Lock className="size-5" />}
								placeholder="Confirm your Password"
								type="password"
							/>
						)}
					</form.Field>
				</FieldSet>

				<SignUpActions
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

				<SignUpFooter />
			</FieldGroup>
		</form>
	);
}
