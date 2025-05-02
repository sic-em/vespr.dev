'use client';

import type { Category, Resource } from '@/prisma/app/generated/prisma/client';
import { useEffect, useRef, useState } from 'react';
import { UserContributionItem } from './user-contribution-item';

type ContributionResource = Pick<
	Resource,
	'id' | 'name' | 'description' | 'imageUrl' | 'views' | 'bookmarkCount'
> & {
	category: Pick<Category, 'slug'>;
};

interface UserContributionsListProps {
	resources: ContributionResource[];
}

export function UserContributionsList({ resources }: UserContributionsListProps) {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [activePillStyle, setActivePillStyle] = useState({});
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		itemRefs.current = itemRefs.current.slice(0, resources.length);
	}, [resources.length]);

	useEffect(() => {
		if (hoveredIndex !== null) {
			const hoveredElement = itemRefs.current[hoveredIndex];
			if (hoveredElement) {
				const { offsetTop, offsetHeight, offsetWidth, offsetLeft } = hoveredElement;
				setActivePillStyle({
					top: `${offsetTop}px`,
					left: `${offsetLeft}px`,
					height: `${offsetHeight}px`,
					width: `${offsetWidth}px`,
				});
			}
		}
	}, [hoveredIndex]);

	if (resources.length === 0) {
		return null;
	}

	return (
		<div className="pt-4 border-t border-dashed">
			<h2 className="text-xl font-semibold mb-6">Recent Contributions</h2>

			<div className="relative">
				{/* Background Highlight */}
				<div
					className="absolute transition-all duration-300 ease-out bg-muted/30 rounded-[8px]"
					style={{
						...activePillStyle,
						opacity: hoveredIndex !== null ? 1 : 0,
					}}
				/>

				{/* Items */}
				<div className="space-y-5 relative">
					{resources.slice(0, 8).map((resource, index) => (
						<div
							key={resource.id}
							ref={(el) => {
								itemRefs.current[index] = el;
							}}
							className="rounded-[8px] p-2 -mx-2"
							onMouseEnter={() => setHoveredIndex(index)}
							onMouseLeave={() => setHoveredIndex(null)}
						>
							<UserContributionItem resource={resource} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
