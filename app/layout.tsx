import type { Metadata } from 'next';
import '@/app/globals.css';
import { CookieConsentBanner } from '@/components/cookie-consent-banner';
import { Banner } from '@/components/ui/banner';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { PostHogProvider } from '@/providers/posthog-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { ArrowUpRight } from 'lucide-react';
import localFont from 'next/font/local';
import Link from 'next/link';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const font = localFont({
	src: '../fonts/FliegeMonoVF.woff2',
	display: 'swap',
});

export const baseUrl =
	process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_URL;

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl as string),
	title: {
		default: 'Vespr | Stack Smarter',
		template: '%s | Vespr',
	},
	description:
		'Discover and integrate top tools, libraries, and resources curated by developers like you. Stack smarter, code faster with Vespr.',
	alternates: {
		canonical: '/',
	},
	openGraph: {
		title: 'Vespr | Stack Smarter',
		description:
			'Discover and integrate top tools, libraries, and resources curated by developers like you. Stack smarter, code faster with Vespr.',
		url: baseUrl,
		siteName:
			'Discover and integrate top tools, libraries, and resources curated by developers like you. Stack smarter, code faster with Vespr.',
		locale: 'en_US',
		type: 'website',
		images: [
			{
				url: `${baseUrl}/opengraph-image.png`,
				width: 800,
				height: 600,
			},
			{
				url: `${baseUrl}/opengraph-image.png`,
				width: 1800,
				height: 1600,
			},
		],
	},
	twitter: {
		title: 'Vespr | Stack Smarter',
		description:
			'Discover and integrate top tools, libraries, and resources curated by developers like you. Stack smarter, code faster with Vespr.',
		images: [
			{
				url: `${baseUrl}/opengraph-image.png`,
				width: 800,
				height: 600,
			},
			{
				url: `${baseUrl}/opengraph-image.png`,
				width: 1800,
				height: 1600,
			},
		],
		card: 'summary_large_image',
		site: '@vesprdev',
		creator: '@vesprdev',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
};

export const viewport = {
	width: 'device-width',
	initialScale: 1.0,
	maximumScale: 1.0,
	userScalable: false,
	viewportFit: 'cover',
	themeColor: [
		{ media: '(prefers-color-scheme: light)' },
		{ media: '(prefers-color-scheme: dark)' },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					font.className,
					'antialiased relative selection:bg-pink-300/30 selection:text-primary',
				)}
			>
				<PostHogProvider>
					<div className="absolute inset-0 pointer-events-none before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[url('/noise.gif')] before:z-[-1] before:content-[''] before:opacity-[0.02] z-[9999]" />
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<NuqsAdapter>
							<Link href="#">
								<Banner variant="rainbow" className="group h-[2.5rem] md:text-sm text-xs">
									<p className="group-hover:underline underline-offset-4 decoration-dashed">
										🚀 Welcome to Vespr! We&apos;re excited to have you here
									</p>
									<ArrowUpRight
										className="size-3.5 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 ease-out shrink-0"
										strokeWidth={2}
									/>
								</Banner>
							</Link>
							{children}
						</NuqsAdapter>
					</ThemeProvider>
					<Toaster richColors />
					<CookieConsentBanner />
				</PostHogProvider>
			</body>
		</html>
	);
}
