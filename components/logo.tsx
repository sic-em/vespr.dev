import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LogoProps {
	className?: string;
}

export const Logo = ({ className }: LogoProps) => {
	return (
		<Link href="/" className={cn(className, 'flex items-center gap-2')}>
			<svg
				width="24"
				height="24"
				viewBox="0 0 200 200"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<title>Logo</title>
				<g clipPath="url(#clip0_234_854)">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M44 0H0V150C0 177.614 22.3858 200 50 200H94V50C94 22.3858 71.6142 0 44 0ZM156 0C128.386 0 106 22.3858 106 50V200H150C177.614 200 200 177.614 200 150V0H156Z"
						fill="url(#paint0_linear_234_854)"
					/>
				</g>
				<defs>
					<linearGradient
						id="paint0_linear_234_854"
						x1="100"
						y1="0"
						x2="100"
						y2="200"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#DF99F7" />
						<stop offset="1" stopColor="#FFDBB0" />
					</linearGradient>
					<clipPath id="clip0_234_854">
						<rect width="200" height="200" fill="white" />
					</clipPath>
				</defs>
			</svg>
			<p className="text-xl tracking-tight font-bold">Vespr</p>
		</Link>
	);
};
