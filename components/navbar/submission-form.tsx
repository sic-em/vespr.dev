'use client';

import { fetchOpenGraphMetadata, submitResource } from '@/app/actions';
import { Spinner } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type SubmissionSchema, submissionSchema } from '@/lib/schemas';
import type { Category } from '@/prisma/app/generated/prisma/client';
import { ResourcePrice } from '@/prisma/app/generated/prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { debounce } from 'lodash-es';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useId, useMemo, useState, useTransition } from 'react';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

type SubmissionFormData = SubmissionSchema;

interface SubmissionFormProps {
	categories: Category[];
	onSuccess?: () => void;
}

export const SubmissionForm = ({ categories, onSuccess }: SubmissionFormProps) => {
	const router = useRouter();

	const [isUrlLoading, setIsUrlLoading] = useState(false);
	const [isSubmitting, startTransition] = useTransition();
	const priceRadioGroupId = useId();

	const form = useForm<SubmissionFormData>({
		resolver: zodResolver(submissionSchema),
		defaultValues: {
			url: '',
			name: '',
			description: '',
			imageUrl: '',
			categoryId: '',
			price: ResourcePrice.FREE,
			recommended: false,
		},
	});

	const watchedUrl = useWatch({ control: form.control, name: 'url' });
	const watchedImageUrl = useWatch({ control: form.control, name: 'imageUrl' });

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
	);

	const debouncedFetchMetadata = useMemo(
		() => debounce(fetchMetadataCallback, 750),
		[fetchMetadataCallback],
	);

	useEffect(() => {
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
				onSuccess?.();
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
										<Spinner className="w-4 h-4 animate-spin text-muted-foreground" />
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
								<Textarea
									placeholder="Describe the resource..."
									{...field}
									className="resize-none h-36"
								/>
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

				<FormField
					control={form.control}
					name="price"
					render={({ field }) => (
						<FormItem className="space-y-3">
							<FormLabel>Price Category</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									className="gap-4"
								>
									<FormItem className="flex items-start gap-2">
										<FormControl>
											<RadioGroupItem value={ResourcePrice.FREE} id={`${priceRadioGroupId}-free`} />
										</FormControl>
										<div className="grid grow gap-1.5">
											<Label htmlFor={`${priceRadioGroupId}-free`} className="font-normal">
												Free
											</Label>
										</div>
									</FormItem>
									<FormItem className="flex items-start gap-2">
										<FormControl>
											<RadioGroupItem value={ResourcePrice.PAID} id={`${priceRadioGroupId}-paid`} />
										</FormControl>
										<div className="grid grow gap-1.5">
											<Label htmlFor={`${priceRadioGroupId}-paid`} className="font-normal">
												Paid
											</Label>
										</div>
									</FormItem>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button variant="accent" type="submit" disabled={isSubmitting} className="w-full">
					{isSubmitting ? <Spinner className="w-4 h-4 mr-2 animate-spin" /> : null}
					Submit
				</Button>
			</form>
		</Form>
	);
};
