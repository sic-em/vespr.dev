'use client';

import { getCategories } from '@/app/actions';
import { LoginButton } from '@/components/auth/login-button';
import { SubmissionForm } from '@/components/navbar/submission-form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import type { Category } from '@/prisma/app/generated/prisma/client';
import { useEffect, useState } from 'react';

interface SubmitResourceButtonProps {
	className?: string;
}

export const SubmitResourceButton = ({ className }: SubmitResourceButtonProps) => {
	const { data: session } = authClient.useSession();
	const [categories, setCategories] = useState<Category[]>([]);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const fetchInitialData = async () => {
			const fetchedCategories = await getCategories();
			setCategories(fetchedCategories);
		};
		fetchInitialData();
	}, []);

	const handleClose = () => setIsOpen(false);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button variant="accent" className={cn(className)}>
					Submit
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-96 mr-2 rounded-[8px] p-4" sideOffset={24}>
				{session?.user ? (
					<SubmissionForm categories={categories} onSuccess={handleClose} />
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
