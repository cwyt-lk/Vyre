"use client";

import { ArrowLeft, Home, Lock, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function Forbidden() {
	const router = useRouter();

	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
			<div className="flex max-w-xl flex-col items-center gap-3 text-center">
				<div className="mb-6 flex items-center gap-4">
					<div className="rounded-2xl bg-destructive/10 p-4 shadow-sm">
						<ShieldAlert className="size-12 text-destructive" />
					</div>

					<h1 className="text-7xl font-extrabold tracking-tight">
						403
					</h1>
				</div>

				<h2 className="text-2xl font-semibold tracking-tight">
					Access Forbidden
				</h2>

				<p className="mt-3 text-muted-foreground">
					You don't have the necessary permissions to view this
					resource.
				</p>

				<div className="mt-8 flex flex-col gap-3 sm:flex-row">
					<Button
						variant="outline"
						size="lg"
						className="gap-2"
						onClick={() => router.push("/")}
					>
						<Home className="size-4" />
						Return Home
					</Button>

					<Button
						variant="outline"
						size="lg"
						className="gap-2"
						onClick={() => router.back()}
					>
						<ArrowLeft className="size-4" />
						Go Back
					</Button>
				</div>

				<div className="mt-10 flex items-center gap-2 text-xs text-muted-foreground/60">
					<Lock className="size-3" />
					<span>Error code: 403 - Forbidden</span>
				</div>
			</div>
		</div>
	);
}
