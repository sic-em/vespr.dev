'use server';

import type { SectionItem } from '@/components/ui/section';
import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { redis } from '@/lib/redis';
import { type SubmissionSchema, submissionSchema } from '@/lib/schemas';
import { type Category, ResourceStatus } from '@/prisma/app/generated/prisma/client';
import type { OpenGraphMetadata } from '@/types/opengraph';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { parse } from 'node-html-parser';

export async function getCategories() {
	return await db.category.findMany({ orderBy: { name: 'asc' } });
}

export async function fetchOpenGraphMetadata(targetUrl: string): Promise<OpenGraphMetadata> {
	const res = await fetch(targetUrl);
	if (!res.ok) {
		throw new Error(`Failed to fetch ${targetUrl}: ${res.status}`);
	}

	const html = await res.text();
	const root = parse(html);

	const getMeta = (attr: string, value: string): string | null =>
		root.querySelector(`meta[${attr}="${value}"]`)?.getAttribute('content') ?? null;

	// og tags
	const ogTitle = getMeta('property', 'og:title');
	const ogDesc = getMeta('property', 'og:description');
	const ogImage = getMeta('property', 'og:image');

	// twitter tags
	const twTitle = getMeta('name', 'twitter:title');
	const twImage = getMeta('name', 'twitter:image');

	// fallbacks
	const htmlTitle = root.querySelector('title')?.text ?? null;
	const htmlDesc =
		getMeta('name', 'description') ??
		root.querySelector('meta[name="Description"]')?.getAttribute('content') ??
		null;

	return {
		title: ogTitle ?? twTitle ?? htmlTitle,
		description: ogDesc ?? htmlDesc,
		image: twImage ?? ogImage,
		url: targetUrl,
	};
}

export async function submitResource(values: SubmissionSchema) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });

		if (!session?.user) {
			return { success: false, message: 'Authentication required.' };
		}

		const validatedFields = submissionSchema.safeParse(values);

		if (!validatedFields.success) {
			console.error('Validation Errors:', validatedFields.error.flatten().fieldErrors);
			return {
				success: false,
				message: 'Invalid form data.',
				errors: validatedFields.error.flatten().fieldErrors,
			};
		}

		const data = validatedFields.data;

		// check if a resource with this url already exists
		const existingResource = await db.resource.findFirst({
			where: { url: data.url },
		});

		if (existingResource) {
			return {
				success: false,
				message: 'A resource with this URL already exists.',
				errors: {
					url: ['This URL has already been submitted.'],
				},
			};
		}

		const status = session.user.role === 'admin' ? ResourceStatus.APPROVED : ResourceStatus.PENDING;

		const category = await db.category.findUnique({
			where: { id: data.categoryId },
			select: { slug: true },
		});

		if (!category) {
			return { success: false, message: 'Selected category not found.' };
		}

		const newResource = await db.resource.create({
			data: {
				...data,
				imageUrl: data.imageUrl || '',
				status,
				userId: session.user.id,
			},
		});

		revalidatePath('/browse');
		revalidatePath(`/browse/${category.slug}`);
		revalidatePath(`/browse/${category.slug}/${newResource.id}`);

		return {
			success: true,
			message: 'Resource submitted successfully!',
			resourceId: newResource.id,
			categorySlug: category.slug,
		};
	} catch (error) {
		console.error('Submission Error:', error);
		return { success: false, message: 'An error occurred during submission.' };
	}
}

export async function getResources() {
	const resources = await db.resource.findMany({
		orderBy: {
			createdAt: 'desc',
		},
	});
	return resources;
}

export type HomepageCategoryData = Category & { items: SectionItem[] };

export async function getResourcesForHomepage(): Promise<HomepageCategoryData[]> {
	const categories = await db.category.findMany({
		include: {
			Resource: {
				where: {
					status: ResourceStatus.APPROVED,
				},
				take: 6,
				orderBy: {
					createdAt: 'desc',
				},
				select: {
					id: true,
					name: true,
					description: true,
					imageUrl: true,
					url: true,
					createdAt: true,
					category: {
						select: {
							slug: true,
						},
					},
				},
			},
		},
		orderBy: {
			name: 'asc',
		},
	});

	return categories.map((category) => ({
		...category,
		items: category.Resource as SectionItem[],
	}));
}

export async function subscribeToNewsletter(email: string) {
	try {
		const API_KEY = process.env.MAILCHIMP_API_KEY;
		const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
		const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

		if (!API_KEY || !AUDIENCE_ID || !SERVER_PREFIX) {
			return { success: false, message: 'Mailchimp configuration is missing' };
		}

		const response = await fetch(
			`https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `apikey ${API_KEY}`,
				},
				body: JSON.stringify({
					email_address: email,
					status: 'subscribed',
				}),
			},
		);

		const data = await response.json();

		if (response.ok) {
			return { success: true, message: 'Successfully subscribed to the newsletter!' };
		}

		// handle existing subscribers
		if (data.title === 'Member Exists') {
			return { success: true, message: 'You are already subscribed to our newsletter.' };
		}
		return { success: false, message: data.detail || 'Failed to subscribe to newsletter' };
	} catch (error) {
		console.error('Newsletter subscription error:', error);
		return { success: false, message: 'An error occurred while subscribing to the newsletter' };
	}
}

export async function getResource(id: string) {
	const resource = await db.resource.findUnique({
		where: { id },
		include: {
			category: true,
			user: true,
		},
	});

	if (!resource) {
		return null;
	}

	try {
		const headerList = await headers();
		const ip = headerList.get('x-forwarded-for') || headerList.get('remote-addr') || 'unknown';

		if (ip !== 'unknown') {
			const redisKey = `views:${id}`;
			const added = await redis.sadd(redisKey, ip);

			if (added === 1) {
				const updatedResource = await db.resource.update({
					where: { id },
					data: { views: { increment: 1 } },
					select: { views: true },
				});
				resource.views = updatedResource.views;
			}
		}
	} catch (error) {
		console.error('Error incrementing view count:', error);
	}

	return resource;
}

export async function getSimilarResources(
	currentItemId: string,
	categoryId: string,
): Promise<SectionItem[]> {
	const similarResources = await db.resource.findMany({
		where: {
			categoryId: categoryId,
			status: ResourceStatus.APPROVED,
			NOT: {
				id: currentItemId,
			},
		},
		take: 6,
		orderBy: {
			createdAt: 'desc',
		},
		select: {
			id: true,
			name: true,
			description: true,
			imageUrl: true,
			url: true,
			category: {
				select: {
					slug: true,
				},
			},
		},
	});

	return similarResources as SectionItem[];
}

export async function toggleBookmarkResource(resourceId: string) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user?.id) {
		return { success: false, message: 'Authentication required.' };
	}

	const userId = session.user.id;

	try {
		let isBookmarked = false;
		let newBookmarkCount = 0;

		await db.$transaction(async (tx) => {
			const existingBookmark = await tx.userResourceBookmark.findUnique({
				where: { userId_resourceId: { userId, resourceId } },
			});

			if (existingBookmark) {
				await tx.userResourceBookmark.delete({
					where: { userId_resourceId: { userId, resourceId } },
				});

				const updatedResource = await tx.resource.update({
					where: { id: resourceId },
					data: { bookmarkCount: { decrement: 1 } },
					select: { bookmarkCount: true },
				});
				isBookmarked = false;
				newBookmarkCount = updatedResource.bookmarkCount;
			} else {
				await tx.userResourceBookmark.create({
					data: { userId, resourceId },
				});

				const updatedResource = await tx.resource.update({
					where: { id: resourceId },
					data: { bookmarkCount: { increment: 1 } },
					select: { bookmarkCount: true },
				});
				isBookmarked = true;
				newBookmarkCount = updatedResource.bookmarkCount;
			}
		});

		const resource = await db.resource.findUnique({
			where: { id: resourceId },
			select: { category: { select: { slug: true } } },
		});

		if (resource?.category?.slug) {
			revalidatePath(`/browse/${resource.category.slug}/${resourceId}`);
		}

		return {
			success: true,
			newBookmarkCount,
			isBookmarked,
		};
	} catch (error) {
		console.error('Error toggling bookmark:', error);
		return { success: false, message: 'Failed to update bookmark status.' };
	}
}
