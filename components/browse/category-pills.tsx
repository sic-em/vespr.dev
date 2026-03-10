'use client';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useCallback, unstable_ViewTransition as ViewTransition } from 'react';
import type { Category } from '@/app/generated/prisma/client';
import { Button } from '@/components/ui/button';

interface CategoryPillsProps {
	categories: Category[];
}

export default function CategoryPills({ categories }: CategoryPillsProps) {
	const [categoryId, setCategoryId] = useQueryState(
		'categoryId',
		parseAsString.withDefault('').withOptions({ shallow: false }),
	);
	const [, setPage] = useQueryState(
		'page',
		parseAsInteger.withDefault(1).withOptions({ shallow: false }),
	);

	const handleCategoryClick = useCallback(
		(id: string) => {
			setPage(1);
			setCategoryId(id === categoryId ? '' : id);
		},
		[categoryId, setCategoryId, setPage],
	);

	return (
		<ViewTransition>
			<div className="flex flex-wrap gap-2 mb-6">
				<Button
					key="all"
					variant={categoryId === '' ? 'accent' : 'outline'}
					size="sm"
					className="rounded-full font-semibold"
					onClick={() => handleCategoryClick('')}
				>
					All
				</Button>

				{categories.map((category) => (
					<Button
						key={category.id}
						variant={categoryId === category.id ? 'accent' : 'outline'}
						size="sm"
						className="rounded-full font-semibold"
						onClick={() => handleCategoryClick(category.id)}
					>
						{category.name}
					</Button>
				))}
			</div>
		</ViewTransition>
	);
}
