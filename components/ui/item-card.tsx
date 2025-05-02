'use client';

import { Badge } from '@/components/ui/badge';
import type { SectionItem } from '@/components/ui/section';
import { LinkIcon, SparklesIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { unstable_ViewTransition as ViewTransition } from 'react';

interface ItemCardProps {
	item: SectionItem & { createdAt?: Date | string | null };
}

export function ItemCard({ item }: ItemCardProps) {
	const placeholderImage = '/placeholder.svg';
	const displayName = item.name || 'Untitled Resource';

	const isNew =
		item.createdAt && new Date(item.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000; // 24 hours

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="relative">
				<Link
					href={`/browse/${item.category.slug}/${item.id}`}
					className="group block aspect-video overflow-hidden rounded-[8px] shadow-sm transition-shadow hover:shadow-md border border-dashed"
				>
					<ViewTransition name={`image-${item.id}`}>
						<Image
							src={item.imageUrl || placeholderImage}
							alt={displayName}
							width={400}
							height={225}
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.srcset = placeholderImage;
								target.src = placeholderImage;
							}}
						/>
					</ViewTransition>
				</Link>
				{isNew && (
					<Badge className="absolute top-2 right-2 px-2 py-0.5 rounded-[8px] bg-gradient-to-b from-pink-200 to-pink-300 text-pink-900 text-xs shadow-md select-none">
						<SparklesIcon className="w-4 h-4 fill-pink-900" />
						NEW
					</Badge>
				)}
			</div>
			<div className="mt-2">
				<Link
					href={`${item.url}?ref=vespr.dev`}
					className="text-xs text-pink-300 hover:underline flex items-center gap-1"
					target="_blank"
					rel="noopener noreferrer"
				>
					<LinkIcon className="w-3 h-3 text-pink-300" />
					{item.url.replace(/^(https?:\/\/)?(www\.)?([^\/]+).*$/, '$3')}
				</Link>
				<ViewTransition name={`title-${item.id}`}>
					<h3 className="line-clamp-1 text-base font-medium leading-tight text-foreground">
						{displayName}
					</h3>
				</ViewTransition>
				<ViewTransition name={`desc-${item.id}`}>
					<p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
				</ViewTransition>
			</div>
		</div>
	);
}
