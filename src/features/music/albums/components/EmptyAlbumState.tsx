"use client";

import { Album, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export const EmptyAlbumState = () => {
	const router = useRouter();

	return (
		<div className="relative flex min-h-[70vh] items-center justify-center px-6">
			<div className="flex max-w-sm flex-col items-center gap-2 text-center">
				<div className="mb-6">
					<div className="rounded-2xl bg-primary/10 p-6 shadow-sm ring-primary/20">
						<Album className="size-16 text-primary" />
					</div>
				</div>

				<h2 className="text-2xl font-bold tracking-tight">
					Collection empty
				</h2>

				<p className="text-muted-foreground">
					There are no albums available to stream at the moment.
					Check back later!
				</p>

				<div className="mt-8">
					<Button
						variant="outline"
						size="lg"
						className="gap-2 px-8"
						onClick={() => router.push("/home")}
					>
						<Home className="size-4" />
						Back to Home
					</Button>
				</div>
			</div>
		</div>
	);
};
