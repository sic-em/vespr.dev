import { Label } from '@/components/ui/label';
import type { Resource } from '@/prisma/app/generated/prisma/client';
import { BookmarkIcon, EyeIcon } from 'lucide-react';

interface ItemStatsSectionProps {
	resource: Pick<Resource, 'views' | 'bookmarkCount'>;
}

export function ItemStatsSection({ resource }: ItemStatsSectionProps) {
	return (
		<div className="space-y-3 text-sm mb-6">
			<div className="flex justify-between items-center">
				<Label>Views</Label>
				<span className="flex items-center gap-1">
					<EyeIcon className="h-4 w-4 text-muted-foreground" />
					{resource.views.toLocaleString()}
				</span>
			</div>
			<div className="flex justify-between items-center">
				<Label>Bookmarks</Label>
				<span className="flex items-center gap-1">
					<BookmarkIcon className="h-4 w-4 text-muted-foreground" />
					{resource.bookmarkCount.toLocaleString()}
				</span>
			</div>
		</div>
	);
}
