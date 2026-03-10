'use client';

import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, unstable_ViewTransition as ViewTransition } from 'react';
import type { Category, Resource } from '@/app/generated/prisma/client';
import { Button } from './button';
import { ItemCard } from './item-card';

export type SectionItem = Pick<
	Resource,
	'id' | 'name' | 'description' | 'imageUrl' | 'url' | 'price'
> & {
	category: Pick<Category, 'slug'>;
};

interface SectionProps {
	title: string;
	items: SectionItem[];
	viewAllHref: string;
	delay?: number;
}

export function Section({ title, items, viewAllHref, delay = 0 }: SectionProps) {
	const sectionRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (sectionRef.current) {
			gsap.fromTo(
				sectionRef.current,
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
					ease: 'power3.out',
					delay: delay,
				},
			);
		}
	}, [delay]);

	if (!items || items.length === 0) {
		return null;
	}

	return (
		<section ref={sectionRef} className="py-2 md:py-4 opacity-0">
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="mb-4 flex items-center justify-between md:mb-6">
					<ViewTransition>
						<h2 className="text-lg font-bold tracking-tight md:text-xl">{title}</h2>
					</ViewTransition>
					<Button asChild variant="ghost" className="group text-sm font-semibold rounded-[8px]">
						<Link href={viewAllHref} className="flex items-center">
							View all
							<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
						</Link>
					</Button>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{items.map((item) => (
						<ViewTransition key={item.id} name={`item-${item.id}`}>
							<ItemCard key={item.id} item={item} />
						</ViewTransition>
					))}
				</div>
			</div>
		</section>
	);
}
