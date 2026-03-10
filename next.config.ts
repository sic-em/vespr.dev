import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: '**',
			},
		],
	},
	experimental: {
		viewTransition: true,
	},
	devIndicators: false,
	skipTrailingSlashRedirect: true,
};

export default nextConfig;
