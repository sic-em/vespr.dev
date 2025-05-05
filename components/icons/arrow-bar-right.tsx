import type { SVGProps } from 'react';

export const ArrowBarRightIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			className={className}
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			{...props}
		>
			<title>Arrow Bar Right</title>
			<path
				d="M18 4v16h2V4h-2zM4 11v2h8v2h-2v2h2v-2h2v-2h2v-2h-2V9h-2V7h-2v2h2v2H4z"
				fill="currentColor"
			/>
		</svg>
	);
};
