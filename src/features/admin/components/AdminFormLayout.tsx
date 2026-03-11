"use client";

import type { ReactNode } from "react";
import { FormGenericActions, FormGenericHeader } from "@/components/form";
import { FieldGroup } from "@/components/ui/Field";

interface AdminFormLayoutProps {
	title: string;
	description: string;
	children: ReactNode;
	isSubmitting: boolean;
	onSubmit: () => void;
	onReset: () => void;
	submitMessage?: string;
	submittingMessage?: string;
}

export function AdminFormLayout({
	title,
	description,
	children,
	isSubmitting,
	onSubmit,
	onReset,
	submitMessage = "Create",
	submittingMessage = "Creating...",
}: AdminFormLayoutProps) {
	return (
		<form
			className="w-full"
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit();
			}}
		>
			<FieldGroup className="mx-auto max-w-2xl space-y-6 p-6">
				<FormGenericHeader
					title={title}
					description={description}
				/>

				{children}

				<FormGenericActions
					message={submitMessage}
					isSubmittingMsg={submittingMessage}
					isSubmitting={isSubmitting}
					onReset={onReset}
				/>
			</FieldGroup>
		</form>
	);
}
