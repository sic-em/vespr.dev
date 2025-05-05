import type { SVGProps } from 'react';

export const ChevronUpIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			className={className}
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			{...props}
		>
			<title>Chevron Up</title>
			<path
				d="M7 16H5v-2h2v-2h2v-2h2V8h2v2h2v2h2v2h2v2h-2v-2h-2v-2h-2v-2h-2v2H9v2H7v2z"
				fill="currentColor"
			/>
		</svg>
	);
};
