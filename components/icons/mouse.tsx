import type { SVGProps } from 'react';

export const MouseIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			className={className}
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			{...props}
		>
			<title>Mouse</title>
			<path d="M6 3h12v18H6V3zm2 2v4h3V5H8zm5 0v4h3V5h-3zm3 6H8v8h8v-8z" />
		</svg>
	);
};
