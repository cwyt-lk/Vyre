"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/Pagination";

interface PaginationClientProps {
	currentPage: number;
	totalPages: number;
	pageWindowSplit?: number;
}

export const PaginationClient = ({
	currentPage,
	totalPages,
	pageWindowSplit = 3,
}: PaginationClientProps) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const prevPage = Math.max(currentPage - 1, 1);
	const nextPage = Math.min(currentPage + 1, totalPages);

	const createPageHref = useCallback(
		(page: number) => {
			const params = new URLSearchParams(searchParams.toString());

			if (page === 1) params.delete("page");
			else params.set("page", String(page));

			const query = params.toString();
			return query ? `${pathname}?${query}` : pathname;
		},
		[pathname, searchParams],
	);

	const visiblePages = useMemo(() => {
		const start = Math.max(1, currentPage - pageWindowSplit);
		const end = Math.min(totalPages, currentPage + pageWindowSplit);

		return Array.from(
			{ length: end - start + 1 },
			(_, i) => start + i,
		);
	}, [currentPage, totalPages, pageWindowSplit]);

	if (totalPages <= 1) return;

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href={createPageHref(prevPage)}
						aria-disabled={currentPage === 1}
					/>
				</PaginationItem>

				{visiblePages.map((page) => (
					<PaginationItem key={page}>
						<PaginationLink
							href={createPageHref(page)}
							isActive={currentPage === page}
						>
							{page}
						</PaginationLink>
					</PaginationItem>
				))}

				<PaginationItem>
					<PaginationNext
						href={createPageHref(nextPage)}
						aria-disabled={currentPage === totalPages}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};
