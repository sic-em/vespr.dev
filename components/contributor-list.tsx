'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { User } from '@/prisma/app/generated/prisma/client';
import Link from 'next/link';
import { unstable_ViewTransition as ViewTransition } from 'react';

export const ContributorList = ({ contributors }: { contributors: User[] }) => {
	return (
		<div className="flex items-center justify-center">
			<TooltipProvider delayDuration={300}>
				<div className="flex -space-x-2 overflow-hidden p-2">
					{contributors.slice(0, 5).map((contributor) => (
						<Tooltip key={contributor.id}>
							<TooltipTrigger asChild>
								<Link
									href={contributor.displayUsername ? `/user/${contributor.displayUsername}` : '#'}
								>
									<ViewTransition name={`user-avatar-${contributor.id}`}>
										<Avatar className="inline-block size-10 rounded-full ring-2 ring-background transition-transform hover:scale-110 hover:z-10">
											<AvatarImage src={contributor.image ?? '/placeholder.svg'} />
											<AvatarFallback className="text-xs">
												{contributor.name[0].toUpperCase()}
											</AvatarFallback>
										</Avatar>
									</ViewTransition>
								</Link>
							</TooltipTrigger>
							<TooltipContent
								side="bottom"
								align="center"
								className="bg-muted text-primary border text-xs"
							>
								@{contributor.displayUsername}
							</TooltipContent>
						</Tooltip>
					))}
					{contributors.length > 5 && (
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold ring-2 ring-background">
									+{contributors.length - 5}
								</div>
							</TooltipTrigger>
							<TooltipContent side="bottom" align="center" className="text-xs">
								{contributors.length - 5} more contributors
							</TooltipContent>
						</Tooltip>
					)}
				</div>
			</TooltipProvider>
		</div>
	);
};
