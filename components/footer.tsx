import { getCategories } from '@/app/actions';
import { FooterLogo } from '@/components/footer-logo';
import { NewsletterForm } from '@/components/newsletter-form';
import Link from 'next/link';

const navigation = [
	{
		label: 'Home',
		href: '/',
	},
	{
		label: 'Browse',
		href: '/browse',
	},
	{
		label: 'Newsletter',
		href: '/newsletter',
	},
];

export const Footer = async () => {
	const categories = await getCategories();

	return (
		<footer className="border-t border-dashed pt-8 mt-16 md:pb-0 pb-16 relative md:h-[600px] h-full overflow-hidden">
			<div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-6">
				<div className="md:grid md:grid-cols-3 flex flex-col-reverse md:gap-8 gap-10">
					{/* Newsletter */}
					<div className="flex flex-col gap-4">
						<h3 className="text-base">Get the latest resources</h3>
						<div className="flex flex-col gap-2 m-0 w-full items-start">
							<NewsletterForm />
							<p className="sm:text-[12px] text-[10px] text-muted-foreground">
								Subscribe to our newsletter to get the latest resources in your inbox.
							</p>
						</div>
					</div>
					{/* Navigation */}
					<div className="flex flex-col gap-4 md:pl-20">
						<h3 className="text-base">Navigation</h3>
						<div className="flex flex-col gap-2">
							{navigation.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4 decoration-dashed transition-colors duration-150 flex items-center gap-1 group w-fit"
								>
									{item.label}
								</Link>
							))}
						</div>
					</div>
					{/* Categories */}
					<div className="flex flex-col gap-4">
						<h3 className="text-base">Categories</h3>
						<div className="flex flex-col gap-2">
							{categories.slice(0, 8).map((category) => (
								<Link
									key={category.id}
									href={`/browse/${category.slug}`}
									className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4 decoration-dashed transition-colors duration-150 flex items-center gap-1 group w-fit"
								>
									{category.name}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
			<div className="md:flex hidden items-center justify-center absolute inset-0 h-fit translate-y-[360px]">
				<FooterLogo />
			</div>
		</footer>
	);
};
