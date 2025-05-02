'use client';

import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger);

export const FooterLogo = () => {
	const textRef = useRef<HTMLDivElement>(null);
	const originalText = 'VESPR.DEV';

	useEffect(() => {
		const element = textRef.current;
		if (!element) return;

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: element,
				start: 'top 80%',
				toggleActions: 'play none none none',
			},
		});

		tl.to(element, {
			duration: 1,
			scrambleText: {
				text: '*********',
				chars: 'lowerCase',
				revealDelay: 0.4,
				speed: 0.3,
			},
		});
		tl.to(element, {
			duration: 1,
			scrambleText: {
				text: originalText,
				chars: 'upperCase',
				speed: 0.3,
			},
			delay: 0.1,
		});

		return () => {
			if (tl.scrollTrigger) {
				tl.scrollTrigger.kill();
			}
			tl.kill();
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
