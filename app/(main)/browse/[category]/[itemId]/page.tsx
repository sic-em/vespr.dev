import { getResource, getSimilarResources } from '@/app/actions';
import { TooltipProvider } from '@/components/ui/tooltip';
import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { ItemActionsBar } from '@/components/item/item-actions-bar';
import { ItemDetailsSection } from '@/components/item/item-details-section';
import { ItemHeader } from '@/components/item/item-header';
import { ItemImageDisplay } from '@/components/item/item-image-display';
import { ItemStatsSection } from '@/components/item/item-stats-section';
import { SimilarItemsSection } from '@/components/item/similar-items-section';
import { ResourceStatus } from '@/prisma/app/generated/prisma/client';
import type { Metadata, ResolvingMetadata } from 'next';

interface ItemPageProps {
	params: Promise<{
		category: string;
		itemId: string;
	}>;
}

export async function generateMetadata(
	{ params }: ItemPageProps,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const resolvedParams = await params;
	const resource = await getResource(resolvedParams.itemId);

	if (!resource) {
		return {
			title: 'Resource Not Found',
		};
	}

	const previousImages = (await parent).openGraph?.images || [];

	return {
		title: `${resource.name} | Vesper`,
		description: resource.description || 'Discover amazing resources on Vesper.',
		openGraph: {
			title: `${resource.name} | Vesper`,
			description: resource.description || 'Discover amazing resources on Vesper.',
			url: `/browse/${resource.category.slug}/${resource.id}`,
			siteName: 'Vesper',
			images: [
				// The generated image will be added automatically by Next.js
				// You can add fallback or additional images here if needed
				// {
				// 	url: resource.imageUrl || '/default-og-image.png',
				// 	width: 1200,
				// 	height: 630,
				// },
				...previousImages,
			],
			locale: 'en_US',
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title: `${resource.name} | Vesper`,
			description: resource.description || 'Discover amazing resources on Vesper.',
			// images: [resource.imageUrl || '/default-twitter-image.png'], // Generated image preferred
		},
	};
}

export default async function ItemPage(props: ItemPageProps) {
	const params = await props.params;
	const { itemId } = params;
	const session = await auth.api.getSession({ headers: await headers() });
	const userId = session?.user?.id;

	const resource = await getResource(itemId);

	if (!resource) {
		return notFound();
	}

	const userBookmark = userId
		? await db.userResourceBookmark.findUnique({
				where: { userId_resourceId: { userId, resourceId: itemId } },
				select: { userId: true },
			})
		: null;
	const initialIsBookmarked = !!userBookmark;

	const similarItems = await getSimilarResources(itemId, resource.categoryId);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6">
			{resource.status === ResourceStatus.PENDING ? (
				<div className="flex flex-col items-center justify-center text-center">
					<h1 className="text-2xl font-semibold">Pending Review</h1>
					<div className="my-3 w-full max-w-xs border-t border-dashed" />
					<p className="text-muted-foreground">
						This resource is currently awaiting approval and is not yet publicly visible.
					</p>
				</div>
			) : (
				<>
					<TooltipProvider delayDuration={100}>
						{/* Main Content Area */}
						<div className="w-full max-w-2xl p-4 md:p-6 font-mono">
							<ItemHeader resource={resource} />
							<div className="my-4 w-full border-t border-dashed" />
							<ItemImageDisplay resource={resource} />
							<ItemDetailsSection resource={resource} />
							<div className="my-3 w-full border-t border-dashed" />
							<ItemStatsSection resource={resource} />
							<div className="my-6 w-full border-t border-dashed" />
							<ItemActionsBar resource={resource} initialIsBookmarked={initialIsBookmarked} />
						</div>
					</TooltipProvider>

					{/* Similar Items */}
					<SimilarItemsSection items={similarItems} category={resource.category} />
				</>
			)}
		</div>
	);
}
