import { useMemo } from 'react';

interface UsePaginationProps {
	currentPage: number;
	totalPages: number;
	paginationItemsToDisplay?: number;
}

export function usePagination({
	currentPage,
	totalPages,
	paginationItemsToDisplay = 5,
}: UsePaginationProps) {
	const { pages, showLeftEllipsis, showRightEllipsis } = useMemo(() => {
		if (totalPages <= paginationItemsToDisplay) {
			return {
				pages: Array.from({ length: totalPages }, (_, i) => i + 1),
				showLeftEllipsis: false,
				showRightEllipsis: false,
			};
		}

		const leftSiblingIndex = Math.max(currentPage - 1, 1);
		const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

		const shouldShowLeftEllipsis = leftSiblingIndex > 2;
		const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

		const firstPageIndex = 1;
		const lastPageIndex = totalPages;

		if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
			const leftItemCount = 3 + 2 * 0;
			const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);

			return {
				pages: leftRange,
				showLeftEllipsis: false,
				showRightEllipsis: true,
			};
		}

		if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
			const rightItemCount = 3 + 2 * 0;
			const rightRange = Array.from(
				{ length: rightItemCount },
				(_, i) => totalPages - rightItemCount + 1 + i,
			);
			return {
				pages: [firstPageIndex, ...rightRange],
				showLeftEllipsis: true,
				showRightEllipsis: false,
			};
		}

		if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
			const middleRange = Array.from({ length: 3 }, (_, i) => leftSiblingIndex + i);
			return {
				pages: [firstPageIndex, ...middleRange, lastPageIndex],
				showLeftEllipsis: true,
				showRightEllipsis: true,
			};
		}

		return {
			pages: Array.from({ length: totalPages }, (_, i) => i + 1),
			showLeftEllipsis: false,
			showRightEllipsis: false,
		};
	}, [currentPage, totalPages, paginationItemsToDisplay]);

	return { pages, showLeftEllipsis, showRightEllipsis };
}
