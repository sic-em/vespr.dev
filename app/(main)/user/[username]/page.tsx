import { notFound } from 'next/navigation';
import { getUser } from '@/app/actions';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UserContributionsList } from '@/components/user/user-contributions-list';
import { UserProfileDetails } from '@/components/user/user-profile-details';
import { UserProfileHeader } from '@/components/user/user-profile-header';
import { UserProfileStats } from '@/components/user/user-profile-stats';

interface UserPageProps {
	params: Promise<{
		username: string;
	}>;
}

export default async function UserPage(props: UserPageProps) {
	const params = await props.params;
	const { username } = params;

	const user = await getUser(username);

	if (!user) {
		return notFound();
	}

	const totalViews = user.resources.reduce((acc, resource) => acc + resource.views, 0);
	const totalBookmarks = user.resources.reduce((acc, resource) => acc + resource.bookmarkCount, 0);

	return (
		<div className="flex min-h-screen flex-col items-center justify-start px-4 sm:px-6 pt-6 pb-16">
			<TooltipProvider delayDuration={100}>
				<div className="w-full max-w-2xl p-4 md:p-6 font-mono bg-background bg-noise">
					<UserProfileHeader user={user} />
					<UserProfileDetails user={user} />
					<UserProfileStats totalViews={totalViews} totalBookmarks={totalBookmarks} />
					<UserContributionsList resources={user.resources} />
				</div>
			</TooltipProvider>
		</div>
	);
}
