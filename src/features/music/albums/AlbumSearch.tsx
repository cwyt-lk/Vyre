"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ChangeEvent, useRef, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/InputGroup";
import { Spinner } from "@/components/ui/Spinner";

export function AlbumSearch() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const queryRef = useRef(searchParams.get("query")?.toString() ?? "");
	const [isPending, startTransition] = useTransition();

	const handleSearch = useDebouncedCallback((term: string) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", "1");

		if (term) {
			params.set("query", term);
		} else {
			params.delete("query");
		}

		startTransition(() => {
			replace(`${pathname}?${params.toString()}`, { scroll: false });
		});
	}, 400);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		handleSearch(e.target.value);
	};

	return (
		<InputGroup>
			<InputGroupAddon>
				{isPending ? (
					<Spinner />
				) : (
					<Search className="text-muted-foreground" />
				)}
			</InputGroupAddon>
			<InputGroupInput
				defaultValue={queryRef.current}
				onChange={handleChange}
				placeholder="Search by Title..."
				aria-label="Search albums"
			/>
		</InputGroup>
	);
}
