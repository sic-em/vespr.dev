import { BookmarkButton } from '@/components/ui/bookmark-button';
import { Button } from '@/components/ui/button';
import type { Resource } from '@/prisma/app/generated/prisma/client';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface ItemActionsBarProps {
	resource: Pick<Resource, 'id' | 'url' | 'bookmarkCount'>;
	initialIsBookmarked: boolean;
}

export function ItemActionsBar({ resource, initialIsBookmarked }: ItemActionsBarProps) {
	return (
		<div className="flex items-center gap-2">
			<Button asChild variant="accent" className="flex-grow">
				<Link href={`${resource.url}?ref=vespr.dev`} target="_blank" rel="noopener noreferrer">
					Visit Resource
					<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
				</Link>
			</Button>
			<BookmarkButton
				resourceId={resource.id}
				initialBookmarks={resource.bookmarkCount}
				initialIsBookmarked={initialIsBookmarked}
			/>
		</div>
	);
}
