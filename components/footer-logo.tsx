'use client';

import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(SplitText);

export const FooterLogo = () => {
	const textRef = useRef<HTMLDivElement>(null);
	const charsRef = useRef<Element[]>([]);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (!textRef.current) return;

		setReady(true);

		const splitText = new SplitText(textRef.current, { type: 'chars' });
		const chars = splitText.chars;
		charsRef.current = chars;

		const tl = gsap.timeline();
		timelineRef.current = tl;

		tl.from(chars, {
			opacity: 0,
			y: 100,
			rotationX: -90,
			stagger: 0.05,
			duration: 0.8,
			ease: 'back.out(1.7)',
		});

		gsap.set(chars, {
			className:
				'text-[380px] font-extrabold select-none leading-none whitespace-nowrap text-muted-foreground/30 origin-bottom cursor-pointer',
		});

		const handleMouseEnter = (char: Element) => {
			gsap.to(char, {
				y: -30,
				scale: 1.05,
				duration: 0.4,
				ease: 'power2.out',
				overwrite: true,
			});
		};

		const handleMouseLeave = (char: Element) => {
			gsap.to(char, {
				y: 0,
				scale: 1,
				duration: 0.4,
				ease: 'power2.in',
				overwrite: true,
			});
		};

		for (const char of chars) {
			char.addEventListener('mouseenter', () => handleMouseEnter(char));
			char.addEventListener('mouseleave', () => handleMouseLeave(char));
		}

		return () => {
			for (const char of chars) {
				char.removeEventListener('mouseenter', () => handleMouseEnter(char));
				char.removeEventListener('mouseleave', () => handleMouseLeave(char));
			}
			if (timelineRef.current) timelineRef.current.kill();
			splitText.revert();
		};
	}, []);

	return (
		<div className="relative overflow-hidden">
			<div ref={textRef} className={`whitespace-nowrap ${ready ? 'opacity-100' : 'opacity-0'}`}>
				vespr
			</div>

			{!ready && (
				<div className="absolute inset-0 text-[380px] font-extrabold leading-none whitespace-nowrap text-muted-foreground/30 opacity-0">
					vespr
				</div>
			)}
		</div>
	);
};
