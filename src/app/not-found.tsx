"use client";

import { ArrowLeft, Ghost, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
	const router = useRouter();

	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
			<div className="flex max-w-xl flex-col items-center gap-3 text-center">
				<div className="mb-6 flex items-center gap-4">
					<div className="rounded-2xl bg-muted p-4 shadow-sm">
						<Ghost className="size-12 text-muted-foreground" />
					</div>

					<h1 className="text-7xl font-extrabold tracking-tight">
						404
					</h1>
				</div>

				<h2 className="text-2xl font-semibold tracking-tight">
					Page not found
				</h2>

				<p className="mt-3 text-muted-foreground">
					The page you’re looking for doesn’t exist or may
					have been moved. Let’s get you back on track.
				</p>

				<div className="mt-8 flex flex-col gap-3 sm:flex-row">
					<Link href="/">
						<Button
							variant="outline"
							size="lg"
							className="gap-2"
						>
							<Home className="size-4" />
							Go Home
						</Button>
					</Link>

					<Button
						variant="outline"
						size="lg"
						className="gap-2"
						onClick={router.back}
					>
						<ArrowLeft className="size-4" />
						Go Back
					</Button>
				</div>

				<p className="mt-10 text-xs text-muted-foreground">
					Error code: 404 - Resource not found
				</p>
			</div>
		</div>
	);
}
