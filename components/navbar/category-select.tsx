'use client';

import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import type { Category } from '@/prisma/app/generated/prisma/client';
import {
	BookOpenIcon,
	ChevronDownIcon,
	CircleHelpIcon,
	FileIcon,
	FileTextIcon,
	HandMetalIcon,
	ImagesIcon,
	LayoutDashboardIcon,
	LibraryIcon,
	ServerIcon,
	SparklesIcon,
	TypeIcon,
	WrenchIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/lib/utils';

const categoryIcons = {
	courses: BookOpenIcon,
	libraries: LibraryIcon,
	services: ServerIcon,
	'components-blocks': LayoutDashboardIcon,
	tools: WrenchIcon,
	articles: FileTextIcon,
	icons: FileIcon,
	fonts: TypeIcon,
	vibing: HandMetalIcon,
	illustrations: ImagesIcon,
	'ui-ux': SparklesIcon,
	misc: CircleHelpIcon,
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
			<HoverCardContent
				align="start"
				className="w-auto p-2 backdrop-blur"
				sideOffset={20}
				alignOffset={-10}
			>
				<div className="flex flex-col space-y-1">
					{categories.map((category) => {
						const Icon =
							categoryIcons[category.slug as keyof typeof categoryIcons] || CircleHelpIcon;
						return (
							<Link
								key={category.id}
								href={`/browse/${category.slug}`}
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
