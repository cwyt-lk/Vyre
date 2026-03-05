"use client";

import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
	message?: string;
	code?: string | number;
	reset?: () => void;
}

export default function ErrorState({
	message = "Something went wrong while loading the data.",
	code = "500",
	reset,
}: ErrorStateProps) {
	const router = useRouter();

	return (
		<div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6">
			<div className="flex max-w-xl flex-col items-center gap-3 text-center">
				<div className="mb-6 flex items-center gap-4">
					<div className="rounded-2xl bg-destructive/10 p-4 shadow-sm">
						<AlertCircle className="size-12 text-destructive" />
					</div>

					<h1 className="text-6xl font-extrabold tracking-tight">
						Sorry!
					</h1>
				</div>

				<h2 className="text-2xl font-semibold tracking-tight">
					Unexpected Error
				</h2>

				<p className="mt-3 text-muted-foreground capitalize">
					{message}
				</p>

				<div className="mt-8 flex flex-col gap-3 sm:flex-row">
					{reset && (
						<Button
							variant="default"
							size="lg"
							className="gap-2"
							onClick={() => reset()}
						>
							<RefreshCw className="size-4" />
							Try Again
						</Button>
					)}

					<Button
						variant="outline"
						size="lg"
						className="gap-2"
						onClick={() => router.push("/")}
					>
						<Home className="size-4" />
						Return Home
					</Button>
				</div>

				<div className="mt-5 flex items-center text-xs text-muted-foreground/60 uppercase tracking-wide">
					<span>Error Code: {code}</span>
				</div>
			</div>
		</div>
	);
}
