import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
	"inline-flex items-center  justify-center gap-2 whitespace-nowrap rounded-[8px] text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
	{
		variants: {
			variant: {
				default:
					'bg-gradient-to-b from-primary/90 to-primary cursor-pointer text-primary-foreground hover:from-primary/80 hover:to-primary/90 duration-300 ease-in-out transition-all shadow-md',
				destructive:
					'bg-gradient-to-b from-red-200 to-red-300 hover:bg-red-300 cursor-pointer text-red-900 hover:from-red-100 hover:to-red-200 duration-300 ease-in-out transition-all shadow-md',
				outline:
					'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input/50 dark:hover:bg-input/50 bg-gradient-to-b from-background to-background/90 hover:from-background/90 hover:to-background/80 transition-transform duration-300 ease-in-out',
				secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
				link: 'text-primary underline-offset-4 hover:underline',
				accent:
					'bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 text-pink-900 hover:from-pink-100 hover:via-pink-200 hover:to-pink-300 cursor-pointer duration-300 ease-in-out transition-colors shadow-md',
			},
			size: {
				default: 'h-9 px-4 py-2 has-[>svg]:px-3',
				sm: 'h-8 rounded-[8px] gap-1.5 px-3 has-[>svg]:px-2.5',
				lg: 'h-10 rounded-[8px] px-6 has-[>svg]:px-4',
				icon: 'size-9',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
