'use client';

import BoringAvatar from 'boring-avatars';
import { useRouter } from 'next/navigation';
import type { User } from '@/app/generated/prisma/client';
import { LogoutIcon, UserIcon } from '@/components/icons';
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
					{user.image ? (
						<Avatar className="h-8 w-8">
							<AvatarImage src={user.image} alt={user.name ?? 'Avatar'} />
						</Avatar>
					) : (
						<span className="inline-block h-8 w-8 overflow-hidden rounded-full">
							<BoringAvatar name={user.displayUsername ?? user.name ?? user.id} size={32} />
						</span>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-4 w-56 rounded-[8px]" sideOffset={24} alignOffset={-10}>
				<div className="flex items-center gap-2">
					{user.image ? (
						<Avatar className="h-8 w-8">
							<AvatarImage src={user.image} alt={user.name ?? 'Avatar'} />
						</Avatar>
					) : (
						<span className="inline-block h-8 w-8 overflow-hidden rounded-full shrink-0">
							<BoringAvatar name={user.displayUsername ?? user.name ?? user.id} size={32} />
						</span>
					)}
					<div className="flex flex-col">
						<p className="text-sm font-semibold">{user.name}</p>
						<p className="text-xs text-muted-foreground">@{user.displayUsername}</p>
					</div>
				</div>
				<DropdownMenuSeparator className="mt-2" />
				<DropdownMenuItem onSelect={() => router.push(`/user/${user.displayUsername}`)}>
					<UserIcon className="w-4 h-4 mr-2" />
					Profile
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
