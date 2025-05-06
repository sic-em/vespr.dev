import db from '@/lib/db';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
		: 'http://localhost:3000';

	const staticRoutes = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 1,
		},
		{
			url: `${baseUrl}/browse`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.8,
		},
	] satisfies MetadataRoute.Sitemap;

	const categories = await db.category.findMany({
		select: {
			slug: true,
			updatedAt: true,
		},
	});

	const categoryRoutes = categories.map((category) => ({
		url: `${baseUrl}/browse/${category.slug}`,
		lastModified: category.updatedAt,
		changeFrequency: 'weekly',
		priority: 0.7,
	})) satisfies MetadataRoute.Sitemap;

	const resources = await db.resource.findMany({
		where: { status: 'APPROVED' },
		select: {
			id: true,
			updatedAt: true,
			category: {
				select: {
					slug: true,
				},
			},
		},
	});

	const resourceRoutes = resources
		.filter((resource) => resource.category?.slug)
		.map((resource) => ({
			url: `${baseUrl}/browse/${resource.category.slug}/${resource.id}`,
			lastModified: resource.updatedAt,
			changeFrequency: 'weekly',
			priority: 0.6,
		})) satisfies MetadataRoute.Sitemap;

	const users = await db.user.findMany({
		select: {
			username: true,
			updatedAt: true,
		},
	});

	const userRoutes = users
		.filter((user) => user.username)
		.map((user) => ({
			url: `${baseUrl}/user/${user.username}`,
			lastModified: user.updatedAt,
			changeFrequency: 'monthly',
			priority: 0.5,
		})) satisfies MetadataRoute.Sitemap;

	return [...staticRoutes, ...categoryRoutes, ...resourceRoutes, ...userRoutes];
}
