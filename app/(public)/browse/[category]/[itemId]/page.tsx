import { getResource, getSimilarResources } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookmarkButton } from '@/components/ui/bookmark-button';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Section } from '@/components/ui/section';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { auth } from '@/lib/auth';
import db from '@/lib/db';
import { format, formatDistanceToNow } from 'date-fns';
import { ArrowUpRight, BookmarkIcon, EyeIcon } from 'lucide-react';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { unstable_ViewTransition as ViewTransition } from 'react';

interface ItemPageProps {
	params: Promise<{
		category: string;
		itemId: string;
	}>;
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
		<div className="flex min-h-screen flex-col items-center justify-start px-4 sm:px-6 pt-6 pb-16">
			{/* Main Container */}
			<TooltipProvider delayDuration={100}>
				<div className="w-full max-w-2xl p-4 md:p-6 font-mono">
					{/* Header */}
					<div className="text-center mb-6">
						<ViewTransition name={`title-${resource.id}`}>
							<h1 className="text-2xl font-semibold mb-2">{resource.name}</h1>
						</ViewTransition>
						<ViewTransition name={`desc-${resource.id}`}>
							<p className="text-sm text-muted-foreground">{resource.description}</p>
						</ViewTransition>
					</div>

					<div className="my-4 w-full border-t border-dashed" />

					{/* Image */}
					{resource.imageUrl && (
						<div className="mb-6 relative aspect-video w-full overflow-hidden rounded-md border">
							<ViewTransition name={`image-${resource.id}`}>
								<Image
									src={resource.imageUrl}
									alt={resource.name}
									fill
									className="object-cover"
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
							</ViewTransition>
						</div>
					)}

					{/* Details Section */}
					<div className="space-y-3 text-sm mb-6">
						<div className="flex justify-between items-center">
							<Label>Category</Label>
							<Link
								href={`/browse/${resource.category.slug}`}
								className="hover:underline decoration-dashed underline-offset-2"
							>
								{resource.category.name}
							</Link>
						</div>
						<div className="flex justify-between items-center">
							<Label>Submitted</Label>
							<Tooltip>
								<TooltipTrigger asChild>
									<span className="cursor-help bg-muted-foreground/10 px-1.5 py-0.5 rounded-[8px]">
										{formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
									</span>
								</TooltipTrigger>
								<TooltipContent>
									<p>{format(new Date(resource.createdAt), "yyyy-MM-dd HH:mm:ss 'UTC'")}</p>
								</TooltipContent>
							</Tooltip>
						</div>
						{resource.user && (
							<div className="flex justify-between items-center">
								<Label>Submitter</Label>
								<span className="flex items-center gap-2">
									<Avatar className="h-5 w-5">
										<AvatarImage
											src={resource.user.image ?? undefined}
											alt={resource.user.name ?? 'User avatar'}
										/>
										<AvatarFallback>
											{resource.user.name ? resource.user.name[0].toUpperCase() : 'U'}
										</AvatarFallback>
									</Avatar>
									<Link
										href={`/user/${resource.user.id}`}
										className="hover:underline decoration-dashed underline-offset-2"
									>
										{resource.user.name || 'Anonymous'}
									</Link>
								</span>
							</div>
						)}
					</div>

					<div className="my-3 w-full border-t border-dashed" />

					{/* Stats */}
					<div className="space-y-3 text-sm mb-6">
						<div className="flex justify-between items-center">
							<Label>Views</Label>
							<span className="flex items-center gap-1">
								<EyeIcon className="h-4 w-4 text-muted-foreground" />
								{resource.views.toLocaleString()}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<Label>Bookmarks</Label>
							<span className="flex items-center gap-1">
								<BookmarkIcon className="h-4 w-4 text-muted-foreground" />
								{resource.bookmarkCount.toLocaleString()}
							</span>
						</div>
					</div>

					<div className="my-6 w-full border-t border-dashed" />

					{/* Action Buttons Wrapper */}
					<div className="flex items-center gap-2">
						<Button
							asChild
							className="flex-grow group bg-gradient-to-b from-pink-800 to-pink-900 rounded-[8px] hover:bg-pink-900 cursor-pointer text-white hover:from-pink-700 hover:to-pink-800 duration-300 ease-in-out transition-colors shadow-md"
						>
							<Link href={resource.url} target="_blank" rel="noopener noreferrer">
								Visit Resource
								<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</Link>
						</Button>
						<BookmarkButton
							resourceId={resource.id}
							initialBookmarks={resource.bookmarkCount}
							initialIsBookmarked={initialIsBookmarked}
						/>
					</div>
				</div>
			</TooltipProvider>

			{/* Similar Items Section */}
			{similarItems.length > 0 && (
				<div className="w-full max-w-6xl mt-12">
					<div className="mb-8 w-full border-t border-dashed" />
					<Section
						title="Similar Items"
						items={similarItems}
						viewAllHref={`/browse/${resource.category.slug}`}
					/>
				</div>
			)}
		</div>
	);
}
