import { getCategories, getResources } from '@/app/actions';
import { Logo } from '@/components/logo';
import { CategorySelect } from '@/components/navbar/category-select';
import { CmdKSearch } from '@/components/navbar/cmdk-search';
import { SubmitResourceButton } from '@/components/navbar/submit-resource-button';
import { buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const Navbar = async () => {
	const categories = await getCategories();
	const resources = await getResources();

	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex items-center justify-between gap-2 md:gap-4 px-6 py-4">
				<div className="flex items-center gap-6">
					<Logo />
					<div className="flex items-center gap-2">
						<Link href="/browse" className={cn(buttonVariants({ variant: 'ghost' }))}>
							Browse
						</Link>
						<CategorySelect categories={categories} />
						<Link href="/newsletter" className={cn(buttonVariants({ variant: 'ghost' }))}>
							Newsletter
						</Link>
					</div>
				</div>
				<div className="flex items-center gap-4">
					<CmdKSearch categories={categories} resources={resources} />
					<ThemeToggle />
					<div className="h-6 w-[1px] bg-muted-foreground/20 rounded-full" />
					<SubmitResourceButton />
				</div>
			</div>
		</nav>
	);
};
