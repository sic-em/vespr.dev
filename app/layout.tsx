import type { Metadata } from 'next';
import './globals.css';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar/navbar';
import { Banner } from '@/components/ui/banner';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/providers/theme-provider';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import localFont from 'next/font/local';

const font = localFont({
	src: '../fonts/DepartureMono-Regular.otf',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'Vespr',
	description: 'A collection of resources for the modern web developer',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn(font.className, 'antialiased bg-noise')}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<NuqsAdapter>
						<Link href="/blog/welcome">
							<Banner variant="rainbow" className="group h-[2.5rem] md:text-sm text-xs">
								<p className="group-hover:underline underline-offset-4 decoration-dashed">
									✨ Welcome to Vespr! We&apos;re excited to have you here
								</p>
								<ArrowUpRight
									className="size-3.5 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 ease-out shrink-0"
									strokeWidth={2}
								/>
							</Banner>
						</Link>
						<Navbar />
						{children}
						<Footer />
					</NuqsAdapter>
				</ThemeProvider>
				<Toaster richColors />
			</body>
		</html>
	);
}
