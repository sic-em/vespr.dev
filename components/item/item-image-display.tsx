'use client';

import BoringAvatar from 'boring-avatars';
import { SparklesIcon } from 'lucide-react';
import Image from 'next/image';
import { useState, unstable_ViewTransition as ViewTransition } from 'react';
import type { Resource } from '@/app/generated/prisma/client';
import { ResourcePrice } from '@/app/generated/prisma/client';
import { DollarIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';

interface ItemImageDisplayProps {
	resource: Pick<Resource, 'id' | 'name' | 'imageUrl' | 'createdAt' | 'price'>;
}

export function ItemImageDisplay({ resource }: ItemImageDisplayProps) {
	const [imageError, setImageError] = useState(false);
	const usePlaceholder = !resource.imageUrl || imageError;

	const isNew =
		resource.createdAt && new Date(resource.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000; // 24 hours

	return (
		<div className="mb-6 relative aspect-video w-full overflow-hidden rounded-md border">
			<ViewTransition name={`image-${resource.id}`}>
				{usePlaceholder ? (
					<div className="absolute inset-0 flex items-center justify-center dark:bg-neutral-900 bg-neutral-100">
						<BoringAvatar name={resource.name ?? resource.id} size={1200} square />
					</div>
				) : (
					<Image
						src={resource.imageUrl}
						alt={resource.name}
						fill
						className="object-fill dark:bg-neutral-900 bg-neutral-100"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						unoptimized
						onError={() => setImageError(true)}
					/>
				)}
			</ViewTransition>

			<ViewTransition name={`badges-${resource.id}`}>
				<div className="flex items-center gap-2 absolute top-2 right-2 z-10">
					{isNew && (
						<Badge className="px-2 py-0.5 rounded-[8px]" variant="accent">
							<SparklesIcon className="w-4 h-4 fill-pink-900" />
							NEW
						</Badge>
					)}
					{resource.price === ResourcePrice.PAID && (
						<Badge className="px-2 py-0.5 rounded-[8px]" variant="accent">
							<DollarIcon className="w-4 h-4 fill-pink-900" />
							PAID
						</Badge>
					)}
				</div>
			</ViewTransition>
		</div>
	);
}
