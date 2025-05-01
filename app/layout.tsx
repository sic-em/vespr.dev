import type { Metadata } from 'next';
import './globals.css';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar/navbar';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/providers/theme-provider';
import { Geist } from 'next/font/google';

export const metadata: Metadata = {
	title: 'Vespr',
	description: 'A collection of resources for the modern web developer',
};

const geistMono = Geist({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	display: 'swap',
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn(geistMono.className, '')}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Navbar />
					{children}
					<Footer />
				</ThemeProvider>
				<Toaster richColors />
			</body>
		</html>
	);
}
