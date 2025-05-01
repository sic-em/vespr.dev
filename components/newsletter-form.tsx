'use client';

import { subscribeToNewsletter } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const NewsletterForm = () => {
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
		<form onSubmit={handleSubmit} className="flex gap-2 w-full items-start">
			<Input
				type="email"
				placeholder="Enter your email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
				className="flex-grow h-9"
				disabled={isLoading}
			/>
			<Button
				type="submit"
				className="flex-shrink-0 h-9 bg-gradient-to-b from-pink-800 to-pink-900 rounded-[8px] hover:bg-pink-900 cursor-pointer text-white hover:from-pink-700 hover:to-pink-800 duration-300 ease-in-out transition-colors shadow-md"
				disabled={isLoading}
			>
				{isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
			</Button>
		</form>
	);
};
