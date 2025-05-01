'use server';

import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { type SubmissionSchema, submissionSchema } from '@/lib/schemas';
import { ResourceStatus } from '@/prisma/app/generated/prisma/client';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { parse } from 'node-html-parser';
import type { OpenGraphMetadata } from '../types/opengraph';

export async function getCategories() {
	const categories = await db.category.findMany();
	return categories;
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

		const { tags, ...data } = validatedFields.data;

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
				tags: tags
					? tags
							.split(',')
							.map((tag) => tag.trim())
							.filter(Boolean)
					: [],
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
