"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	type ChangeEvent,
	useCallback,
	useEffect,
	useState,
	useTransition,
} from "react";
import { useDebouncedCallback } from "use-debounce";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/InputGroup";
import { Spinner } from "@/components/ui/Spinner";

export interface SearchBarProps {
	placeholder?: string;
	queryField?: string;
	debounceMs?: number;
}

export const SearchBar = ({
	placeholder = "Search...",
	queryField = "query",
	debounceMs = 400,
}: SearchBarProps) => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const [isPending, startTransition] = useTransition();

	const [search, setSearch] = useState(
		() => searchParams.get(queryField) ?? "",
	);

	// Keep input in sync with URL
	useEffect(() => {
		const param = searchParams.get(queryField) ?? "";

		setSearch((prev) => (prev !== param ? param : prev));
	}, [searchParams, queryField]);

	const updateURL = useCallback(
		(term: string) => {
			const params = new URLSearchParams(searchParams);

			if (term) {
				params.set(queryField, term);
			} else {
				params.delete(queryField);
			}

			startTransition(() => {
				replace(`${pathname}?${params.toString()}`, {
					scroll: false,
				});
			});
		},
		[pathname, queryField, replace, searchParams],
	);

	const debouncedUpdate = useDebouncedCallback(updateURL, debounceMs);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		setSearch(value);
		debouncedUpdate(value);
	};

	return (
		<search>
			<InputGroup>
				<InputGroupAddon>
					{isPending ? (
						<Spinner />
					) : (
						<Search
							className="text-muted-foreground"
							aria-hidden="true"
						/>
					)}
				</InputGroupAddon>

				<InputGroupInput
					type="search"
					value={search}
					onChange={handleChange}
					placeholder={placeholder}
					aria-label={placeholder}
					autoComplete="off"
				/>
			</InputGroup>
		</search>
	);
};
