import { Section, type SectionItem } from '@/components/ui/section';
import type { Category } from '@/prisma/app/generated/prisma/client';

interface SimilarItemsSectionProps {
	items: SectionItem[];
	category: Pick<Category, 'slug'>;
}

export function SimilarItemsSection({ items, category }: SimilarItemsSectionProps) {
	if (items.length === 0) {
		return null;
	}

	return (
		<div className="w-full max-w-6xl mt-12">
			<div className="mb-8 w-full border-t border-dashed" />
			<Section title="Similar Items" items={items} viewAllHref={`/browse/${category.slug}`} />
		</div>
	);
}
