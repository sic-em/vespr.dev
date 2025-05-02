'use client';

import type { Category, Resource } from '@/prisma/app/generated/prisma/client';
import { BookmarkIcon, EyeIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { unstable_ViewTransition as ViewTransition } from 'react';

type ContributionResource = Pick<
	Resource,
	'id' | 'name' | 'description' | 'imageUrl' | 'views' | 'bookmarkCount'
> & {
	category: Pick<Category, 'slug'>;
};

interface UserContributionItemProps {
	resource: ContributionResource;
}

export function UserContributionItem({ resource }: UserContributionItemProps) {
	return (
		<ViewTransition name={`resource-${resource.id}`}>
			<Link
				href={`/browse/${resource.category.slug}/${resource.id}`}
				className="flex items-center gap-3 w-full transition-colors rounded-sm"
			>
				{resource.imageUrl && (
					<div className="relative h-12 w-12 overflow-hidden rounded-sm border flex-shrink-0">
						<Image
							src={resource.imageUrl}
							alt={resource.name}
							fill
							className="object-cover"
							sizes="48px"
						/>
					</div>
				)}
				<div className="flex-grow min-w-0">
					<h3 className="text-sm font-medium truncate">{resource.name}</h3>
					<p className="text-xs text-muted-foreground truncate">{resource.description}</p>
					<div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
						<span className="flex items-center gap-1">
							<EyeIcon className="h-3 w-3" />
							{resource.views}
						</span>
						<span className="flex items-center gap-1">
							<BookmarkIcon className="h-3 w-3" />
							{resource.bookmarkCount}
						</span>
					</div>
				</div>
			</Link>
		</ViewTransition>
	);
}
