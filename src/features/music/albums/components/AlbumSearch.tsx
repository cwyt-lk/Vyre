"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ChangeEvent, useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/InputGroup";
import { Spinner } from "@/components/ui/Spinner";

export const AlbumSearch = () => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const [isPending, startTransition] = useTransition();
	const [search, setSearch] = useState(searchParams.get("query") ?? "");

	const handleSearch = useDebouncedCallback((term: string) => {
		const params = new URLSearchParams(searchParams);

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
				value={search}
				onChange={(e) => {
					setSearch(e.target.value);
					handleChange(e);
				}}
				placeholder="Search by Title..."
				aria-label="Search albums"
			/>
		</InputGroup>
	);
};
