'use client';

import { fetchOpenGraphMetadata, submitResource } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { authClient } from '@/lib/auth-client';
import { type SubmissionSchema, submissionSchema } from '@/lib/schemas';
import type { Category } from '@/prisma/app/generated/prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { debounce } from 'lodash-es';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

type SubmissionFormData = SubmissionSchema;

interface SubmissionFormProps {
	categories: Category[];
}

export const SubmissionForm = ({ categories }: SubmissionFormProps) => {
	const { data: session } = authClient.useSession();
	const isAdmin = session?.user?.role === 'admin';
	const router = useRouter();

	const [isUrlLoading, setIsUrlLoading] = useState(false);
	const [isSubmitting, startTransition] = useTransition();

	const form = useForm<SubmissionFormData>({
		resolver: zodResolver(submissionSchema),
		defaultValues: {
			url: '',
			name: '',
			description: '',
			imageUrl: '',
			categoryId: '',
			tags: '',
			openSource: false,
			paid: false,
			recommended: false,
		},
	});

	const watchedUrl = useWatch({ control: form.control, name: 'url' });
	const watchedImageUrl = useWatch({ control: form.control, name: 'imageUrl' });

	// 1. Define the core fetching logic with useCallback
	const fetchMetadataCallback = useCallback(
		async (targetUrl: string) => {
			if (!targetUrl || !/^(http|https):\/\/[^ "\\.]+\.[^ "\\.]+/.test(targetUrl)) {
				return;
			}
			setIsUrlLoading(true);
			try {
				const metadata = await fetchOpenGraphMetadata(targetUrl);
				if (metadata.title) form.setValue('name', metadata.title, { shouldValidate: true });
				if (metadata.description)
					form.setValue('description', metadata.description, { shouldValidate: true });
				if (metadata.image) form.setValue('imageUrl', metadata.image, { shouldValidate: true });
				else {
					form.setError('imageUrl', {
						type: 'manual',
						message: 'Could not automatically fetch an image URL.',
					});
					toast.warning('Could not fetch image URL.');
				}
			} catch (error) {
				console.error('Error fetching metadata:', error);
				toast.error('Failed to fetch metadata from URL.');
			} finally {
				setIsUrlLoading(false);
			}
		},
		[form],
	); // form object is stable, added for clarity

	// 2. Create the debounced version using useMemo
	const debouncedFetchMetadata = useMemo(
		() => debounce(fetchMetadataCallback, 750),
		[fetchMetadataCallback],
	);

	useEffect(() => {
		// 3. Call the debounced function and add cleanup
		debouncedFetchMetadata(watchedUrl);
		return () => {
			debouncedFetchMetadata.cancel();
		};
	}, [watchedUrl, debouncedFetchMetadata]);

	const onSubmit: SubmitHandler<SubmissionFormData> = (values) => {
		startTransition(async () => {
			const result = await submitResource(values);
			if (result.success && result.resourceId && result.categorySlug) {
				toast.success(result.message);
				form.reset();
				router.push(`/browse/${result.categorySlug}/${result.resourceId}`);
			} else {
				toast.error(result.message || 'Submission failed.');
				if (result.errors) {
					for (const [field, errors] of Object.entries(result.errors)) {
						if (errors && errors.length > 0) {
							form.setError(field as keyof SubmissionFormData, {
								type: 'server',
								message: (errors as string[]).join(', '),
							});
						}
					}
				}
			}
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="url"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Resource URL</FormLabel>
							<div className="relative">
								<FormControl>
									<Input placeholder="https://example.com" {...field} />
								</FormControl>
								{isUrlLoading && (
									<div className="absolute right-2 top-1/2 -translate-y-1/2">
										<Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
									</div>
								)}
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Resource Name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea placeholder="Describe the resource..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="categoryId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select a category" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{categories.map((category) => (
										<SelectItem key={category.id} value={category.id}>
											{category.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="imageUrl"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Image URL</FormLabel>
							<FormControl>
								<Input placeholder="https://example.com/image.png" {...field} />
							</FormControl>
							<FormMessage />
							{watchedImageUrl?.startsWith('http') && (
								<div className="mt-2 aspect-video relative w-full overflow-hidden rounded-md border">
									<Image src={watchedImageUrl} alt="Image Preview" fill className="object-cover" />
								</div>
							)}
						</FormItem>
					)}
				/>

				{isAdmin && (
					<FormField
						control={form.control}
						name="tags"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tags (Admin Only)</FormLabel>
								<FormControl>
									<Input placeholder="react, ui, components" {...field} />
								</FormControl>
								<FormDescription>Comma-separated list of relevant tags.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<div className="flex items-center space-x-4 pt-2">
					<FormField
						control={form.control}
						name="openSource"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center space-x-2">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
										id="openSource"
									/>
								</FormControl>
								<FormLabel htmlFor="openSource" className="text-sm font-normal cursor-pointer">
									Open Source
								</FormLabel>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="paid"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center space-x-2">
								<FormControl>
									<Checkbox checked={field.value} onCheckedChange={field.onChange} id="paid" />
								</FormControl>
								<FormLabel htmlFor="paid" className="text-sm font-normal cursor-pointer">
									Paid
								</FormLabel>
							</FormItem>
						)}
					/>
					{isAdmin && (
						<FormField
							control={form.control}
							name="recommended"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center space-x-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
											id="recommended"
										/>
									</FormControl>
									<FormLabel htmlFor="recommended" className="text-sm font-normal cursor-pointer">
										Recommended
									</FormLabel>
								</FormItem>
							)}
						/>
					)}
				</div>

				<Button
					type="submit"
					disabled={isSubmitting}
					className="w-full bg-gradient-to-b from-pink-800 to-pink-900 rounded-[8px] hover:bg-pink-900 font-bold cursor-pointer text-white hover:from-pink-700 hover:to-pink-800 duration-300 ease-in-out transition-colors"
				>
					{isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
					Submit Resource
				</Button>
			</form>
		</Form>
	);
};
