import { DollarIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import type { Resource } from '@/prisma/app/generated/prisma/client';
import { ResourcePrice } from '@/prisma/app/generated/prisma/client';
import { SparklesIcon } from 'lucide-react';
import Image from 'next/image';
import { unstable_ViewTransition as ViewTransition } from 'react';

interface ItemImageDisplayProps {
	resource: Pick<Resource, 'id' | 'name' | 'imageUrl' | 'createdAt' | 'price'>;
}

export function ItemImageDisplay({ resource }: ItemImageDisplayProps) {
	if (!resource.imageUrl) {
		return null;
	}

	const isNew =
		resource.createdAt && new Date(resource.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000; // 24 hours

	return (
		<div className="mb-6 relative aspect-video w-full overflow-hidden rounded-md border">
			<ViewTransition name={`image-${resource.id}`}>
				<Image
					src={resource.imageUrl}
					alt={resource.name}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
			</ViewTransition>

			<ViewTransition name={`badges-${resource.id}`}>
				<div className="flex items-center gap-2 absolute top-2 right-2 z-10">
					{isNew && (
						<Badge className="px-2 py-0.5 rounded-[8px]" variant="accent">
							<SparklesIcon className="w-4 h-4 fill-purple-900" />
							NEW
						</Badge>
					)}
					{resource.price === ResourcePrice.PAID && (
						<Badge className="px-2 py-0.5 rounded-[8px]" variant="accent">
							<DollarIcon className="w-4 h-4 fill-purple-900" />
							PAID
						</Badge>
					)}
				</div>
			</ViewTransition>
		</div>
	);
}
