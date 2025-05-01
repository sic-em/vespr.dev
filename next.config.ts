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
};

export default nextConfig;
