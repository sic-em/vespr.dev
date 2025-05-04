'use client';

import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import type { Category } from '@/prisma/app/generated/prisma/client';
import { ChevronDownIcon, CircleHelpIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import {
	FaceThinkingIcon,
	FigmaIcon,
	GridIcon,
	H1Icon,
	HumanRunIcon,
	ImageIcon,
	LightbulbIcon,
	MoreHorizontalIcon,
	MouseIcon,
	PowerIcon,
	RocketIcon,
	WritingIcon,
} from '@/components/icons';
import { cn } from '@/lib/utils';

const categoryIcons = {
	courses: WritingIcon,
	libraries: PowerIcon,
	services: RocketIcon,
	'components-blocks': GridIcon,
	tools: MouseIcon,
	'mini-guides': LightbulbIcon,
	icons: FaceThinkingIcon,
	fonts: H1Icon,
	vibing: HumanRunIcon,
	illustrations: ImageIcon,
	'ui-ux': FigmaIcon,
	misc: MoreHorizontalIcon,
};

export const CategorySelect = ({ categories }: { categories: Category[] }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<HoverCard openDelay={100} closeDelay={100} onOpenChange={setIsOpen}>
			<HoverCardTrigger asChild>
				<Button variant="ghost" className="cursor-pointer">
					Categories
					<ChevronDownIcon
						className={cn(
							'w-4 h-4 ml-1 transition-transform duration-200',
							isOpen ? 'rotate-180' : '',
						)}
					/>
				</Button>
			</HoverCardTrigger>
			<HoverCardContent align="start" className="w-auto p-4" sideOffset={23} alignOffset={-10}>
				<div className="grid grid-cols-2 gap-x-4 gap-y-1">
					{categories.map((category) => {
						const Icon =
							categoryIcons[category.slug as keyof typeof categoryIcons] || CircleHelpIcon;
						return (
							<Link
								key={category.id}
								href={`/browse?categoryId=${category.id}`}
								className="px-2 py-1.5 text-sm rounded-md hover:bg-accent flex items-center gap-2"
							>
								<Icon className="w-4 h-4" />
								{category.name}
							</Link>
						);
					})}
				</div>
			</HoverCardContent>
		</HoverCard>
	);
};
