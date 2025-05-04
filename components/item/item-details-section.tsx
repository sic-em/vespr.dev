import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Category, Resource, User } from '@/prisma/app/generated/prisma/client';
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { unstable_ViewTransition as ViewTransition } from 'react';

type ResourceWithDetails = Pick<Resource, 'id' | 'createdAt' | 'userId'> & {
	category: Pick<Category, 'id' | 'name'>;
	user: Pick<User, 'id' | 'name' | 'image' | 'displayUsername'> | null;
};

interface ItemDetailsSectionProps {
	resource: ResourceWithDetails;
}

export function ItemDetailsSection({ resource }: ItemDetailsSectionProps) {
	return (
		<div className="space-y-3 text-sm mb-6">
			<div className="flex justify-between items-center">
				<Label>Category</Label>
				<Link
					href={`/browse?categoryId=${resource.category.id}`}
					className="hover:underline decoration-dashed underline-offset-2"
				>
					{resource.category.name}
				</Link>
			</div>
			<div className="flex justify-between items-center">
				<Label>Submitted</Label>
				<Tooltip>
					<TooltipTrigger asChild>
						<span className="cursor-help bg-muted px-1.5 py-0.5 rounded-[8px]">
							{formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
						</span>
					</TooltipTrigger>
					<TooltipContent className="bg-muted text-primary border">
						<p>{format(new Date(resource.createdAt), "yyyy-MM-dd HH:mm:ss 'UTC'")}</p>
					</TooltipContent>
				</Tooltip>
			</div>
			{resource.user && (
				<div className="flex justify-between items-center">
					<Label>Submitter</Label>
					<span className="flex items-center gap-2">
						<ViewTransition name={`user-avatar-${resource.user.id}`}>
							<Avatar className="h-5 w-5">
								<AvatarImage
									src={resource.user.image ?? undefined}
									alt={resource.user.name ?? 'User avatar'}
								/>
								<AvatarFallback>
									{resource.user.name ? resource.user.name[0].toUpperCase() : 'U'}
								</AvatarFallback>
							</Avatar>
						</ViewTransition>
						<Link
							href={`/user/${resource.user.displayUsername}`}
							className="hover:underline decoration-dashed underline-offset-2"
						>
							{resource.user.name || 'Anonymous'}
						</Link>
					</span>
				</div>
			)}
		</div>
	);
}
