import Link from 'next/link';
import { getCategories } from '@/app/actions';
import { FooterLogo } from '@/components/footer-logo';
import { NewsletterForm } from '@/components/newsletter-form';

// TODO: Add newsletter link

const navigation = [
	{
		label: 'Home',
		href: '/',
	},
	{
		label: 'Browse',
		href: '/browse',
	},
	// {
	// 	label: 'Newsletter',
	// 	href: '/newsletter',
	// },
];

export const Footer = async () => {
	const categories = await getCategories();

	return (
		<footer className="bg-background/95 bg-noise px-7 py-6">
			{/* Top border */}
			<div className="border-t border-dashed mb-6" />

			{/* Main Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-6">
				{/* Left section */}
				<div className="flex flex-col justify-between">
					<p className="text-lg text-muted-foreground mb-6">
						Friends let friends know about
						<br />
						fresh resources and content.
					</p>

					<NewsletterForm className="w-full max-w-md" />
				</div>

				{/* Right section */}
				<div className="mt-8 grid grid-cols-1 gap-y-8 md:mt-0 md:grid-cols-2 md:gap-4 md:border-l md:border-dashed md:border-border md:pl-6">
					{/* Navigation column */}
					<div className="flex flex-col justify-between">
						<div>
							<h3 className="font-semibold mb-3">Navigation</h3>
							<ul className="space-y-2">
								{navigation.map((item) => (
									<li key={item.href}>
										<Link
											href={item.href}
											className="hover:underline decoration-dashed underline-offset-4 text-muted-foreground hover:text-foreground duration-200 ease-in-out transition-colors"
										>
											{item.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Categories column */}
					<div>
						<h3 className="font-semibold mb-3">Categories</h3>
						<ul className="space-y-2">
							{categories.map((category) => (
								<li key={category.id}>
									<Link
										href={`/browse?categoryId=${category.id}`}
										className="hover:underline decoration-dashed underline-offset-4 text-muted-foreground hover:text-foreground duration-200 ease-in-out transition-colors"
									>
										{category.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			<div className="hidden md:block border-t border-dashed mt-6" />

			<FooterLogo />
		</footer>
	);
};
