'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { subscribeToNewsletter } from '@/app/actions';
import { Spinner } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NewsletterFormProps {
	className?: string;
}

export const NewsletterForm = ({ className }: NewsletterFormProps) => {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!email || !email.includes('@')) {
			toast.error('Please enter a valid email address');
			return;
		}

		setIsLoading(true);

		try {
			const result = await subscribeToNewsletter(email);

			if (result.success) {
				toast.success(result.message);
				setEmail('');
			} else {
				toast.error(result.message);
			}
		} catch (error: unknown) {
			console.error('Newsletter subscription error:', error);
			toast.error('Failed to subscribe. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className={cn('flex gap-2 w-full items-start', className)}>
			<Input
				type="email"
				placeholder="Enter your email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
				className="flex-grow h-9"
				disabled={isLoading}
			/>
			<Button type="submit" variant="accent" className="flex-shrink-0 h-9" disabled={isLoading}>
				{isLoading ? <Spinner className="w-4 h-4 animate-spin" /> : 'Subscribe'}
			</Button>
		</form>
	);
};
