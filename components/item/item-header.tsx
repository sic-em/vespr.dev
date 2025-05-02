import type { Resource } from '@/prisma/app/generated/prisma/client';
import { unstable_ViewTransition as ViewTransition } from 'react';

interface ItemHeaderProps {
	resource: Pick<Resource, 'id' | 'name' | 'description'>;
}

export function ItemHeader({ resource }: ItemHeaderProps) {
	return (
		<div className="text-center mb-6">
			<ViewTransition name={`title-${resource.id}`}>
				<h1 className="text-2xl font-semibold mb-2">{resource.name}</h1>
			</ViewTransition>
			<ViewTransition name={`desc-${resource.id}`}>
				<p className="text-sm text-muted-foreground">{resource.description}</p>
			</ViewTransition>
		</div>
	);
}
