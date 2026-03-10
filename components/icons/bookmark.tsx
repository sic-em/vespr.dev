import { forwardRef, type SVGProps } from 'react';

interface BookmarkIconProps extends SVGProps<SVGSVGElement> {
	className?: string;
	filled?: boolean;
}

export const BookmarkIcon = forwardRef<SVGSVGElement, BookmarkIconProps>(
	({ className, filled = false, ...props }, ref) => {
		return (
			<svg
				ref={ref}
				className={className}
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				{...props}
			>
				<title>{filled ? 'Bookmarked' : 'Bookmark'}</title>
				{filled ? (
					<polygon points="20 2 20 23 19 23 19 22 18 22 18 21 17 21 17 20 16 20 16 19 15 19 15 18 14 18 14 17 13 17 13 16 11 16 11 17 10 17 10 18 9 18 9 19 8 19 8 20 7 20 7 21 6 21 6 22 5 22 5 23 4 23 4 2 5 2 5 1 19 1 19 2 20 2" />
				) : (
					<path d="m19,2v-1H5v1h-1v21h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h2v1h1v1h1v1h1v1h1v1h1v1h1v1h1V2h-1Zm-1,16h-1v-1h-1v-1h-1v-1h-1v-1h-4v1h-1v1h-1v1h-1v1h-1V4h1v-1h10v1h1v14Z" />
				)}
			</svg>
		);
	},
);

BookmarkIcon.displayName = 'BookmarkIcon';
