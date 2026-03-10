'use client';

import { parseAsInteger, useQueryState } from 'nuqs';
import { useCallback, unstable_ViewTransition as ViewTransition } from 'react';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
} from '@/components/ui/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { ArrowBarLeftIcon, ArrowBarRightIcon, ChevronLeftIcon, ChevronRightIcon } from '../icons';

interface BrowsePaginationProps {
	currentPage: number;
	totalPages: number;
	paginationItemsToDisplay?: number;
}

export default function BrowsePagination({
	currentPage,
	totalPages,
	paginationItemsToDisplay = 5,
}: BrowsePaginationProps) {
	const [, setPage] = useQueryState(
		'page',
		parseAsInteger.withDefault(1).withOptions({ shallow: false }),
	);

	const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
		currentPage,
		totalPages,
		paginationItemsToDisplay,
	});

	const handlePageChange = useCallback(
		(newPage: number) => {
			if (newPage >= 1 && newPage <= totalPages) {
				setPage(newPage);
				// Scroll to top after page change
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		},
		[setPage, totalPages],
	);

	if (totalPages <= 1) {
		return null;
	}

	return (
		<ViewTransition>
			<Pagination>
				<PaginationContent>
					{/* First page button */}
					<PaginationItem>
						<PaginationLink
							href="#"
							onClick={(e) => {
								e.preventDefault();
								handlePageChange(1);
							}}
							className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
							aria-label="Go to first page"
							aria-disabled={currentPage === 1}
						>
							<ArrowBarLeftIcon className="size-4" aria-hidden="true" />
						</PaginationLink>
					</PaginationItem>

					{/* Previous page button */}
					<PaginationItem>
						<PaginationLink
							href="#"
							onClick={(e) => {
								e.preventDefault();
								handlePageChange(currentPage - 1);
							}}
							className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
							aria-label="Go to previous page"
							aria-disabled={currentPage === 1}
						>
							<ChevronLeftIcon className="size-4" aria-hidden="true" />
						</PaginationLink>
					</PaginationItem>

					{/* Left ellipsis (...) */}
					{showLeftEllipsis && (
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					)}

					{/* Page number links */}
					{pages.map((page) => (
						<PaginationItem key={page}>
							<PaginationLink
								href="#"
								onClick={(e) => {
									e.preventDefault();
									handlePageChange(page);
								}}
								isActive={page === currentPage}
							>
								{page}
							</PaginationLink>
						</PaginationItem>
					))}

					{/* Right ellipsis (...) */}
					{showRightEllipsis && (
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					)}

					{/* Next page button */}
					<PaginationItem>
						<PaginationLink
							href="#"
							onClick={(e) => {
								e.preventDefault();
								handlePageChange(currentPage + 1);
							}}
							className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
							aria-label="Go to next page"
							aria-disabled={currentPage === totalPages}
						>
							<ChevronRightIcon className="size-4" aria-hidden="true" />
						</PaginationLink>
					</PaginationItem>

					{/* Last page button */}
					<PaginationItem>
						<PaginationLink
							href="#"
							onClick={(e) => {
								e.preventDefault();
								handlePageChange(totalPages);
							}}
							className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
							aria-label="Go to last page"
							aria-disabled={currentPage === totalPages}
						>
							<ArrowBarRightIcon className="size-4" aria-hidden="true" />
						</PaginationLink>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</ViewTransition>
	);
}
