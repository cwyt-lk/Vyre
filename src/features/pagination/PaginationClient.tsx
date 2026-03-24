"use client";

import { usePathname, useSearchParams } from "next/navigation";
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

	const createPageHref = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", String(page));

		return `${pathname}?${params.toString()}`;
	};

	const getVisiblePages = () => {
		const start = Math.max(1, currentPage - pageWindowSplit);
		const end = Math.min(totalPages, currentPage + pageWindowSplit);

		const pages = [];

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		return pages;
	};

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious href={createPageHref(prevPage)} />
				</PaginationItem>

				{getVisiblePages().map((page) => (
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
					<PaginationNext href={createPageHref(nextPage)} />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};
