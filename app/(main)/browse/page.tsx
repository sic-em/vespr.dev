import { getCategories, getContributors, getResourcesBrowse } from '@/app/actions';
import CategoryPills from '@/components/browse/category-pills';
import BrowsePagination from '@/components/browse/pagination';
import ResourceGrid from '@/components/browse/resource-grid';
import { Hero } from '@/components/hero';
import { createSearchParamsCache, parseAsInteger, parseAsString } from 'nuqs/server';

const searchParamsCache = createSearchParamsCache({
	categoryId: parseAsString.withDefault(''),
	page: parseAsInteger.withDefault(1),
	search: parseAsString.withDefault(''),
});

export default async function BrowsePage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const params = await searchParamsCache.parse(searchParams);

	const [categories, contributors, resourcesData] = await Promise.all([
		getCategories(),
		getContributors(),
		getResourcesBrowse({
			page: params.page,
			categoryId: params.categoryId,
			search: params.search,
			limit: 24,
		}),
	]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-start px-4 sm:px-6 pt-6 pb-16">
			<Hero contributors={contributors} />

			<div className="w-full max-w-[1400px] mt-8">
				<CategoryPills categories={categories} />

				<div className="mt-8">
					<ResourceGrid resources={resourcesData.resources} />
				</div>

				{resourcesData.totalPages > 1 && (
					<div className="mt-8">
						<BrowsePagination
							currentPage={resourcesData.currentPage}
							totalPages={resourcesData.totalPages}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
