import Link from 'next/link';
import { unstable_ViewTransition as ViewTransition } from 'react';
import type { User } from '@/app/generated/prisma/client';
import { GithubIcon } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface UserProfileHeaderProps {
	user: Pick<User, 'id' | 'name' | 'email' | 'image' | 'displayUsername' | 'username' | 'role'>;
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
	return (
		<div className="text-center mb-8">
			<div className="flex flex-col items-center justify-center">
				<ViewTransition name={`user-avatar-${user.id}`}>
					<div className="relative">
						<Avatar className="h-20 w-20 mb-3">
							<AvatarImage src={user.image ?? undefined} alt={user.name} />
							<AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
						</Avatar>
						{user.role === 'admin' && (
							<span className="absolute end-0 top-0">
								<span className="sr-only">Admin</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										className="fill-background"
										d="M3.046 8.277A4.402 4.402 0 0 1 8.303 3.03a4.4 4.4 0 0 1 7.411 0 4.397 4.397 0 0 1 5.19 3.068c.207.713.23 1.466.067 2.19a4.4 4.4 0 0 1 0 7.415 4.403 4.403 0 0 1-3.06 5.187 4.398 4.398 0 0 1-2.186.072 4.398 4.398 0 0 1-7.422 0 4.398 4.398 0 0 1-5.257-5.248 4.4 4.4 0 0 1 0-7.437Z"
									/>
									<path
										className="fill-pink-300"
										d="M4.674 8.954a3.602 3.602 0 0 1 4.301-4.293 3.6 3.6 0 0 1 6.064 0 3.598 3.598 0 0 1 4.3 4.302 3.6 3.6 0 0 1 0 6.067 3.6 3.6 0 0 1-4.29 4.302 3.6 3.6 0 0 1-6.074 0 3.598 3.598 0 0 1-4.3-4.293 3.6 3.6 0 0 1 0-6.085Z"
									/>
									<path
										className="fill-background"
										d="M15.707 9.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L11 12.586l3.293-3.293a1 1 0 0 1 1.414 0Z"
									/>
								</svg>
							</span>
						)}
					</div>
				</ViewTransition>
				<h1 className="text-2xl font-semibold mb-1">{user.name}</h1>
				{user.displayUsername && (
					<p className="text-sm text-muted-foreground flex items-center gap-1">
						@{user.displayUsername}
					</p>
				)}
				{user.username && (
					<Button variant="outline" size="icon" className="mt-2" asChild>
						<Link
							href={`https://github.com/${user.username}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<GithubIcon className="w-4 h-4" />
						</Link>
					</Button>
				)}
			</div>
		</div>
	);
}
