import type { SVGProps } from 'react';

export const BarsIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			className={className}
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			{...props}
		>
			<title>Bars</title>
			<rect x="1" y="11" width="22" height="2" />
			<rect x="1" y="19" width="22" height="2" />
			<rect x="1" y="3" width="22" height="2" />
		</svg>
	);
};
