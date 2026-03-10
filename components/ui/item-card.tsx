'use client';

import BoringAvatar from 'boring-avatars';
import { SparklesIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, unstable_ViewTransition as ViewTransition } from 'react';
import { ResourcePrice } from '@/app/generated/prisma/client';
import { DollarIcon, LinkIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import type { SectionItem } from '@/components/ui/section';

interface ItemCardProps {
	item: SectionItem & { createdAt?: Date | string | null };
}

export function ItemCard({ item }: ItemCardProps) {
	const [imageError, setImageError] = useState(false);
	const displayName = item.name || 'Untitled Resource';
	const usePlaceholder = !item.imageUrl || imageError;

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
						{usePlaceholder ? (
							<div className="flex h-full w-full items-center justify-center dark:bg-neutral-900 bg-neutral-100 transition-transform duration-300 group-hover:scale-105">
								<BoringAvatar name={item.name ?? item.id} size={400} square />
							</div>
						) : (
							<Image
								src={item.imageUrl}
								alt={displayName}
								width={400}
								height={225}
								className="h-full w-full object-fill transition-transform duration-300 group-hover:scale-105 dark:bg-neutral-900 bg-neutral-100"
								onError={() => setImageError(true)}
								priority
								unoptimized
							/>
						)}
					</ViewTransition>
				</Link>

				<ViewTransition name={`badges-${item.id}`}>
					<div className="flex items-center gap-2 absolute top-2 right-2">
						{isNew && (
							<Badge variant="accent" className="px-2 py-0.5 rounded-[8px] ">
								<SparklesIcon className="w-4 h-4 fill-pink-900" />
								NEW
							</Badge>
						)}
						{item.price === ResourcePrice.PAID && (
							<Badge variant="accent" className="px-2 py-0.5 rounded-[8px] ">
								<DollarIcon className="w-4 h-4 fill-pink-900" />
								PAID
							</Badge>
						)}
					</div>
				</ViewTransition>
			</div>
			<div className="mt-2">
				<Link
					href={`${item.url}?ref=vespr.dev`}
					className="text-xs text-pink-500 font-semibold dark:text-pink-300 hover:underline decoration-dashed underline-offset-2 flex items-center gap-1"
					target="_blank"
					rel="noopener noreferrer"
				>
					<LinkIcon className="w-3 h-3 text-pink-300 dark:text-pink-500" />
					{item.url.replace(/^(https?:\/\/)?(www\.)?([^/]+).*$/, '$3')}
				</Link>
				<ViewTransition name={`title-${item.id}`}>
					<h3 className="line-clamp-1 text-base font-semibold leading-tight text-foreground">
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
