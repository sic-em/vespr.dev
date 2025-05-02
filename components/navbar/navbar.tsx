import { getCategories, getResources } from '@/app/actions';
import { Logo } from '@/components/logo';
import { CategorySelect } from '@/components/navbar/category-select';
import { CmdKSearch } from '@/components/navbar/cmdk-search';
import { MobileNav } from '@/components/navbar/mobile-nav';
import { SubmitResourceButton } from '@/components/navbar/submit-resource-button';
import { buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { auth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { headers } from 'next/headers';
import Link from 'next/link';

export const Navbar = async () => {
	const categories = await getCategories();
	const resources = await getResources();
	const session = await auth.api.getSession({ headers: await headers() });

	return (
		<nav className="sticky top-0 z-50 w-full border-b border-dashed bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/90">
			<div className="flex items-center justify-between gap-2 md:gap-4 px-6 py-4">
				<div className="flex items-center gap-6">
					<Logo />
					{/* Navigation Links */}
					<div className="hidden md:flex items-center gap-2">
						<Link href="/browse" className={cn(buttonVariants({ variant: 'ghost' }))}>
							Browse
						</Link>
						<Link href="/newsletter" className={cn(buttonVariants({ variant: 'ghost' }))}>
							Newsletter
						</Link>
						<CategorySelect categories={categories} />
						{session?.user?.role === 'admin' && (
							<Link href="/admin" className={cn(buttonVariants({ variant: 'ghost' }))}>
								Admin
							</Link>
						)}
					</div>
				</div>
				<div className="flex items-center gap-4">
					{/* Right-side elements */}
					<div className="hidden md:flex items-center gap-4">
						<CmdKSearch categories={categories} resources={resources} />
						<ThemeToggle />
						<div className="h-6 w-[1px] bg-muted-foreground/20 rounded-full" />
						<SubmitResourceButton />
					</div>
					{/* Mobile Nav */}
					<MobileNav
						categories={categories}
						submitButton={<SubmitResourceButton className="w-full" />}
					/>
				</div>
			</div>
		</nav>
	);
};
