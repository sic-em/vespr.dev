import { getContributors, getResourcesForHomepage } from '@/app/actions';
import { Hero } from '@/components/hero';
import { Section } from '@/components/ui/section';

export default async function Home() {
	const categoriesWithResources = await getResourcesForHomepage();
	const contributors = await getContributors();
	return (
		<main className="flex min-h-screen flex-col gap-4 items-center justify-start px-4 sm:px-6 pt-6 pb-16">
			<Hero contributors={contributors} />
			{categoriesWithResources.map((category, index) => (
				<Section
					key={category.id}
					title={category.name}
					items={category.items}
					viewAllHref={`/browse/${category.slug}`}
					delay={0.2 + index * 0.1}
				/>
			))}
		</main>
	);
}
