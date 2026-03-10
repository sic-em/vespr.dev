'use client';

import { unstable_ViewTransition as ViewTransition } from 'react';
import type { Category, Resource } from '@/app/generated/prisma/client';
import { ItemCard } from '@/components/ui/item-card';

interface ResourceWithCategory extends Resource {
	category: Category;
}

interface ResourceGridProps {
	resources: ResourceWithCategory[];
}

export default function ResourceGrid({ resources }: ResourceGridProps) {
	return (
		<ViewTransition>
			{resources.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-64 text-center">
					<h3 className="text-xl font-semibold text-muted-foreground">Oops! Nothing here... 🤷</h3>
					<p className="text-sm text-muted-foreground mt-2">
						Looks like this corner is empty. Try a different category or search term!
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{resources.map((resource) => (
						<ItemCard
							key={resource.id}
							item={{
								id: resource.id,
								name: resource.name,
								description: resource.description,
								imageUrl: resource.imageUrl,
								url: resource.url,
								price: resource.price,
								category: {
									slug: resource.category.slug,
								},
								createdAt: resource.createdAt,
							}}
						/>
					))}
				</div>
			)}
		</ViewTransition>
	);
}
