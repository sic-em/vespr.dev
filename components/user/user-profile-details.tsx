import { format, formatDistanceToNow } from 'date-fns';
import type { Resource, User } from '@/app/generated/prisma/client';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface UserProfileDetailsProps {
	user: Pick<User, 'createdAt' | 'updatedAt'> & {
		resources: Pick<Resource, 'id'>[];
	};
}

export function UserProfileDetails({ user }: UserProfileDetailsProps) {
	return (
		<div className="space-y-3 text-sm mb-6">
			<div className="flex justify-between items-center">
				<Label>Member Since</Label>
				<Tooltip>
					<TooltipTrigger asChild>
						<span className="cursor-help bg-muted-foreground/10 px-1.5 py-0.5 rounded-[8px]">
							{formatDistanceToNow(new Date(user.createdAt), {
								addSuffix: true,
							})}
						</span>
					</TooltipTrigger>
					<TooltipContent className="bg-muted text-primary border">
						<p>{format(new Date(user.createdAt), "yyyy-MM-dd HH:mm:ss 'UTC'")}</p>
					</TooltipContent>
				</Tooltip>
			</div>

			<div className="flex justify-between items-center">
				<Label>Contributions</Label>
				<span>{user.resources.length}</span>
			</div>
		</div>
	);
}
