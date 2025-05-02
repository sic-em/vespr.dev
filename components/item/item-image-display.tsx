import type { Resource } from '@/prisma/app/generated/prisma/client';
import Image from 'next/image';
import { unstable_ViewTransition as ViewTransition } from 'react';

interface ItemImageDisplayProps {
	resource: Pick<Resource, 'id' | 'name' | 'imageUrl'>;
}

export function ItemImageDisplay({ resource }: ItemImageDisplayProps) {
	if (!resource.imageUrl) {
		return null;
	}

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
		</div>
	);
}
