'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import Link from 'next/link';
import type * as React from 'react';
import type { Category } from '@/app/generated/prisma/client';
import { BarsIcon } from '@/components/icons';
import { Button, buttonVariants } from '@/components/ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

interface MobileNavProps {
	categories: Category[];
	submitButton: React.ReactNode;
}

export function MobileNav({ categories, submitButton }: MobileNavProps) {
	return (
		<Drawer>
			<DrawerTrigger asChild className="md:hidden">
				<Button variant="ghost" size="icon">
					<BarsIcon className="h-5 w-5" />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full p-4 flex flex-col h-full">
					<DrawerHeader className="p-0 mb-4">
						<VisuallyHidden>
							<DrawerTitle>Navigation</DrawerTitle>
						</VisuallyHidden>
						<p className="text-base font-normal text-foreground px-2">Navigation</p>
					</DrawerHeader>

					<div className="flex flex-col gap-2 items-start mb-4 flex-grow overflow-y-auto">
						<Link
							href="/browse"
							className={cn(
								buttonVariants({ variant: 'ghost' }),
								'w-full justify-start text-base font-normal px-2',
							)}
						>
							Browse All
						</Link>
						<Link
							href="/newsletter"
							className={cn(
								buttonVariants({ variant: 'ghost' }),
								'w-full justify-start text-base font-normal px-2',
							)}
						>
							Newsletter
						</Link>

						<div className="w-full h-[1px] bg-muted/50 rounded-full my-3" />

						<p className="text-sm font-semibold text-muted-foreground px-2 mb-2">Categories</p>
						{categories.map((category) => (
							<Link
								key={category.id}
								href={`/browse?categoryId=${category.id}`}
								className={cn(
									buttonVariants({ variant: 'ghost' }),
									'w-full justify-start text-base font-normal px-2',
								)}
							>
								{category.name}
							</Link>
						))}
					</div>

					<DrawerFooter className="p-0 mt-4 gap-3 border-t border-dashed pt-4">
						{submitButton}
						<DrawerClose asChild>
							<Button variant="outline" className="w-full">
								Close
							</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
