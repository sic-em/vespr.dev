'use client';

import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger);

export const FooterLogo = () => {
	const textRef = useRef<HTMLDivElement>(null);
	const tlHover = useRef<gsap.core.Timeline | null>(null);
	const originalText = 'VESPR.DEV';

	useEffect(() => {
		const element = textRef.current;
		if (!element) return;

		const tlScroll = gsap.timeline({
			scrollTrigger: {
				trigger: element,
				start: 'top 80%',
				toggleActions: 'play none none none',
			},
		});

		tlScroll.to(element, {
			duration: 1,
			scrambleText: {
				text: '*********',
				chars: 'lowerCase',
				revealDelay: 0.4,
				speed: 0.3,
			},
		});
		tlScroll.to(element, {
			duration: 1,
			scrambleText: {
				text: originalText,
				chars: 'upperCase',
				speed: 0.3,
			},
			delay: 0.1,
		});

		const handleMouseEnter = () => {
			if (tlHover.current) {
				tlHover.current.kill();
			}
			tlHover.current = gsap.timeline();
			tlHover.current.to(element, {
				duration: 1,
				scrambleText: {
					text: '*********',
					chars: 'lowerCase',
					revealDelay: 0.4,
					speed: 0.3,
				},
			});
			tlHover.current.to(element, {
				duration: 1,
				scrambleText: {
					text: originalText,
					chars: 'upperCase',
					speed: 0.3,
				},
				delay: 0.1,
			});
		};

		const handleMouseLeave = () => {
			if (tlHover.current) {
				tlHover.current.kill();
			}
			gsap.to(element, {
				duration: 0.3,
				scrambleText: { text: originalText, chars: 'upperCase' },
			});
		};

		element.addEventListener('mouseenter', handleMouseEnter);
		element.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			if (tlScroll.scrollTrigger) {
				tlScroll.scrollTrigger.kill();
			}
			tlScroll.kill();

			if (tlHover.current) {
				tlHover.current.kill();
			}

			if (element) {
				element.removeEventListener('mouseenter', handleMouseEnter);
				element.removeEventListener('mouseleave', handleMouseLeave);
			}
		};
	}, []);

	return (
		<div className="mt-6 w-full flex justify-center">
			<div
				ref={textRef}
				className="hidden md:block text-muted-foreground/20 leading-none font-bold tracking-tighter cursor-pointer md:text-[150px] lg:text-[200px] xl:text-[300px]"
			>
				{originalText}
			</div>
		</div>
	);
};
