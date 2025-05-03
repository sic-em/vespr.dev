'use client';

import { CogIcon, LogoutIcon, UserIcon } from '@/components/icons';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { authClient } from '@/lib/auth-client';
import type { User } from '@/prisma/app/generated/prisma/client';
import { useRouter } from 'next/navigation';

export default function UserButton({ user }: { user: Omit<User, 'password'> }) {
	const router = useRouter();

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push('/');
				},
			},
		});
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full">
					<Avatar className="h-8 w-8">
						<AvatarImage src={user.image ?? '/placeholder.svg'} alt={user.name ?? 'Avatar'} />
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-4 w-56 rounded-[8px]" sideOffset={24} alignOffset={-10}>
				<div className="flex items-center gap-2">
					<Avatar className="h-8 w-8">
						<AvatarImage src={user.image ?? '/placeholder.svg'} alt={user.name ?? 'Avatar'} />
					</Avatar>
					<div className="flex flex-col">
						<p className="text-sm font-semibold">{user.name}</p>
						<p className="text-xs text-muted-foreground">@{user.username}</p>
					</div>
				</div>
				<DropdownMenuSeparator className="mt-2" />
				<DropdownMenuItem onSelect={() => router.push(`/user/${user.username}`)}>
					<UserIcon className="w-4 h-4 mr-2" />
					Profile
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => router.push('/settings')}>
					<CogIcon className="w-4 h-4 mr-2" />
					Settings
				</DropdownMenuItem>
				<ThemeToggle />
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout}>
					<LogoutIcon className="w-4 h-4 mr-2" />
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
