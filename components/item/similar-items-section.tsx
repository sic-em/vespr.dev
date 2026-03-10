import type { Category } from '@/app/generated/prisma/client';
import { Section, type SectionItem } from '@/components/ui/section';

interface SimilarItemsSectionProps {
	items: SectionItem[];
	category: Pick<Category, 'id'>;
}

export function SimilarItemsSection({ items, category }: SimilarItemsSectionProps) {
	if (items.length === 0) {
		return null;
	}

	return (
		<div className="w-full max-w-6xl mt-12">
			<div className="mb-8 w-full border-t border-dashed" />
			<Section
				title="Similar Items"
				items={items}
				viewAllHref={`/browse?categoryId=${category.id}`}
			/>
		</div>
	);
}
