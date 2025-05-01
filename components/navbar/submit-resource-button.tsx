import { getCategories } from '@/app/actions';
import { LoginButton } from '@/components/auth/login-button';
import { SubmissionForm } from '@/components/navbar/submission-form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { auth } from '@/lib/auth';
import { PlusIcon } from 'lucide-react';
import { headers } from 'next/headers';

export const SubmitResourceButton = async () => {
	const [session, categories] = await Promise.all([
		auth.api.getSession({ headers: await headers() }),
		getCategories(),
	]);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className="bg-gradient-to-b from-pink-800 to-pink-900 rounded-[8px] hover:bg-pink-900 font-bold cursor-pointer text-white hover:from-pink-700 hover:to-pink-800 duration-300 ease-in-out transition-colors shadow-md">
					<PlusIcon className="w-4 h-4" />
					Submit
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-96 mr-2 rounded-[8px] p-4 backdrop-blur" sideOffset={24}>
				{session?.user ? (
					<SubmissionForm categories={categories} />
				) : (
					<div className="flex flex-col items-center justify-center space-y-4 p-4">
						<p className="text-center text-sm text-muted-foreground">
							Please login to submit a resource
						</p>
						<LoginButton />
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
};
