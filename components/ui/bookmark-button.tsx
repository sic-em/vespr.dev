'use client';

import { toggleBookmarkResource } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { BookmarkIcon, CheckIcon } from 'lucide-react';
import { useEffect, useOptimistic, useRef, useTransition } from 'react';
import { toast } from 'sonner';

interface BookmarkButtonProps {
	resourceId: string;
	initialBookmarks: number;
	initialIsBookmarked: boolean;
}

export function BookmarkButton({
	resourceId,
	initialBookmarks,
	initialIsBookmarked,
}: BookmarkButtonProps) {
	const [isPending, startTransition] = useTransition();
	const [optimisticState, setOptimisticState] = useOptimistic(
		{ bookmarks: initialBookmarks, isBookmarked: initialIsBookmarked },
		(state, action: 'bookmark' | 'unbookmark') => {
			return {
				bookmarks: action === 'bookmark' ? state.bookmarks + 1 : state.bookmarks - 1,
				isBookmarked: action === 'bookmark',
			};
		},
	);

	const outlineIconRef = useRef<SVGSVGElement>(null);
	const filledIconRef = useRef<SVGSVGElement>(null);
	const checkIconRef = useRef<SVGSVGElement>(null);
	const iconContainerRef = useRef<HTMLSpanElement>(null);

	const tl = useRef<gsap.core.Timeline | null>(null);

	useEffect(() => {
		gsap.set(checkIconRef.current, { opacity: 0, scale: 0.5 });
		if (initialIsBookmarked) {
			gsap.set(outlineIconRef.current, { opacity: 0, scale: 0.5 });
			gsap.set(filledIconRef.current, { opacity: 1, scale: 1 });
		} else {
			gsap.set(outlineIconRef.current, { opacity: 1, scale: 1 });
			gsap.set(filledIconRef.current, { opacity: 0, scale: 0.5 });
		}
	}, [initialIsBookmarked]);

	const handleClick = () => {
		const action = optimisticState.isBookmarked ? 'unbookmark' : 'bookmark';

		tl.current = gsap.timeline();

		const currentIcon = optimisticState.isBookmarked
			? filledIconRef.current
			: outlineIconRef.current;
		const nextIcon = optimisticState.isBookmarked ? outlineIconRef.current : filledIconRef.current;

		tl.current
			.to(currentIcon, { opacity: 0, scale: 0.5, duration: 0.15, ease: 'power1.in' })
			.to(
				checkIconRef.current,
				{ opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(1.7)' },
				'>-0.05',
			)
			.to(
				checkIconRef.current,
				{ opacity: 0, scale: 0.5, duration: 0.15, ease: 'power1.in' },
				'>0.3',
			)
			.to(nextIcon, { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(1.7)' }, '>-0.05');

		startTransition(async () => {
			setOptimisticState(action);
			const result = await toggleBookmarkResource(resourceId);
			if (!result.success) {
				tl.current?.reverse();
				toast.error(result.message || 'Failed to update bookmark.');
			}
		});
	};

	return (
		<Button
			variant="outline"
			className="flex items-center gap-1.5 relative overflow-hidden"
			onClick={handleClick}
			disabled={isPending}
			aria-label={optimisticState.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
		>
			<span ref={iconContainerRef} className="relative w-4 h-4 flex items-center justify-center">
				<BookmarkIcon
					ref={outlineIconRef}
					className={cn('h-4 w-4 absolute text-muted-foreground')}
				/>
				<BookmarkIcon
					ref={filledIconRef}
					className={cn('h-4 w-4 absolute fill-current text-foreground')}
				/>
				<CheckIcon ref={checkIconRef} className={cn('h-4 w-4 absolute text-foreground')} />
			</span>
			<span className="min-w-[1ch] text-xs font-medium text-muted-foreground">
				{optimisticState.bookmarks.toLocaleString()}
			</span>
		</Button>
	);
}
