'use client';

import { useEffect, useRef, useState } from 'react';
import type { Category, Resource } from '@/app/generated/prisma/client';
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
	const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

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
		<div className="pt-6 border-t border-dashed">
			<h2 className="text-xl font-semibold mb-4">Recent Contributions</h2>

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
				<ul className="space-y-5 relative list-none p-0 m-0">
					{resources.slice(0, 8).map((resource, index) => (
						<li
							key={resource.id}
							ref={(el) => {
								itemRefs.current[index] = el;
							}}
							className="rounded-[8px] p-2 -mx-2"
							onMouseEnter={() => setHoveredIndex(index)}
							onMouseLeave={() => setHoveredIndex(null)}
						>
							<UserContributionItem resource={resource} />
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
