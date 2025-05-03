'use client';

import { ContributorList } from '@/components/contributor-list';
import { LogoIcon } from '@/components/logo';
import type { User } from '@/prisma/app/generated/prisma/client';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export const Hero = ({ contributors }: { contributors: User[] }) => {
	const heroRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (heroRef.current) {
			gsap.fromTo(
				heroRef.current,
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
			);
		}
	}, []);

	return (
		<div ref={heroRef} className="flex flex-col items-center justify-center my-12 gap-2 opacity-0">
			<LogoIcon className="w-30 h-30" />
			<h2 className="text-3xl md:text-4xl lg:text-3xl font-bold tracking-tight text-center text-balance mt-2">
				Vespr
			</h2>
			<div className="mt-2">
				<p className="text-muted-foreground text-sm text-center mb-4">
					Curated resources for your next project. Built by the community.
				</p>
				<ContributorList contributors={contributors} />
			</div>
		</div>
	);
};
