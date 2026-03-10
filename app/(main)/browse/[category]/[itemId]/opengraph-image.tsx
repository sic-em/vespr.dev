import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { getResource } from '@/app/actions';

export const alt = 'Vesper Resource';
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = 'image/png';

export const dynamic = 'force-dynamic';

const OgLogo = ({ size = 60 }: { size?: number }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 113.78 86.52"
		fill="white"
		width={size}
		height={size * (86.52 / 113.78)}
	>
		<title> </title>
		<path d="M56.82,39.62c.36-.11.65-.36.81-.7,2.67-5.78,6.91-12.31,12.35-18.67C82.98,5.07,97.97-3.41,103.48,1.3c5.39,4.61-.33,20.17-12.77,35.07,12.91.72,22.34,4.78,23.03,10.74.84,7.16-11.19,14.66-27.83,17.93,5.47,8.6,7.01,16.89,3.22,20.13-4.69,4.01-15.76-1.23-24.74-11.71-2.11-2.46-3.92-5-5.38-7.48l-.21-.19c-1.43-1.29-3.63-1.15-4.88.31h0c-1.45,2.45-3.24,4.94-5.31,7.36-8.98,10.48-20.05,15.72-24.74,11.71-3.81-3.26-2.23-11.63,3.31-20.27C10.9,61.56-.79,54.17.04,47.11c.68-5.83,9.7-9.83,22.16-10.69C9.72,21.51,3.99,5.92,9.38,1.3c5.5-4.71,20.5,3.77,33.5,18.95,5.44,6.35,9.67,12.87,12.34,18.65.28.61.96.92,1.59.72h0Z" />
	</svg>
);

export default async function Image({ params }: { params: { itemId: string } }) {
	const fontData = await readFile(join(process.cwd(), 'fonts', 'FliegeMono-Bold.otf'));

	const { itemId } = params;
	const resource = await getResource(itemId);

	if (!resource || !resource.imageUrl) {
		return null;
	}

	const imageUrl = resource.imageUrl.startsWith('http')
		? resource.imageUrl
		: `${process.env.NEXT_PUBLIC_BASE_URL}${resource.imageUrl.startsWith('/') ? '' : '/'}${resource.imageUrl}`;

	return new ImageResponse(
		<div
			style={{
				height: '100%',
				width: '100%',
				display: 'flex',
				position: 'relative',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#1a1a1a',
			}}
		>
			{/* ImageResponse only supports raw <img>; next/image is not available */}
			<img
				src={imageUrl}
				alt={resource.name}
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					filter: 'brightness(0.7)',
				}}
			/>

			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					background:
						'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%)',
					mixBlendMode: 'normal',
					backgroundImage:
						'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjEuNSIgbnVtT2N0YXZlcz0iMiIgc3RpdGNoVGlsZXM9InN0aXRjaCI+PC9mZVR1cmJ1bGVuY2U+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlRmlsdGVyKSI+PC9yZWN0Pjwvc3ZnPg==")',
					backgroundBlendMode: 'soft-light',
					filter: 'contrast(105%) brightness(100%)',
					opacity: 0.12,
				}}
			/>

			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '32px',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignSelf: 'flex-start',
						background: 'linear-gradient(to bottom right, #fabfdd, #f78dc5, #f362ab)',
						padding: '6px 12px',
						borderRadius: '8px',
						border: 'none',
						boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
					}}
				>
					<span
						style={{
							fontSize: 22,
							color: '#831843',
							fontFamily: "'FliegeMono-Bold'",
							letterSpacing: '0.05em',
						}}
					>
						now @ vespr.dev
					</span>
				</div>

				<div
					style={{
						display: 'flex',
						alignSelf: 'flex-end',
						backgroundColor: 'transparent',
						padding: '0',
						borderRadius: '0',
						border: 'none',
					}}
				>
					<OgLogo size={90} />
				</div>
			</div>
		</div>,
		{
			...size,
			fonts: [
				{
					name: 'FliegeMono-Bold',
					data: fontData,
					style: 'normal',
				},
			],
		},
	);
}
