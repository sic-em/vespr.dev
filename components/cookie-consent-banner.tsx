'use client';
import { cn } from '@/lib/utils';
import { usePostHog } from 'posthog-js/react';
import { useEffect, useState } from 'react';

export function getCookieConsentValue(): 'yes' | 'no' | 'undecided' {
	if (typeof window === 'undefined') {
		return 'undecided';
	}
	const consent = localStorage.getItem('cookie_consent');
	if (consent === 'yes' || consent === 'no') {
		return consent;
	}
	return 'undecided';
}

export function CookieConsentBanner() {
	const [consentGiven, setConsentGiven] = useState<'yes' | 'no' | 'undecided'>('undecided');
	const posthog = usePostHog();

	useEffect(() => {
		setConsentGiven(getCookieConsentValue());
	}, []);

	useEffect(() => {
		if (consentGiven !== 'undecided' && posthog) {
			try {
				posthog.set_config({
					persistence: consentGiven === 'yes' ? 'localStorage+cookie' : 'memory',
				});
			} catch (error) {
				console.error('Error setting PostHog config:', error);
			}
		}
	}, [consentGiven, posthog]);

	const handleAcceptCookies = () => {
		localStorage.setItem('cookie_consent', 'yes');
		setConsentGiven('yes');
	};

	const handleDeclineCookies = () => {
		localStorage.setItem('cookie_consent', 'no');
		setConsentGiven('no');
	};

	if (consentGiven !== 'undecided') {
		return null;
	}

	return (
		<div
			className={cn(
				'fixed bottom-0 left-0 right-0 z-50 w-full p-4 bg-background border-t font-mono text-xs shadow-md',
				'md:bottom-4 md:left-4 md:right-auto md:top-auto md:w-auto md:max-w-[240px] md:p-2 md:border md:border-dashed md:rounded-sm md:shadow-none',
			)}
		>
			<div className="flex flex-col gap-2">
				<p className="leading-tight text-center md:text-left">
					Cookies = better site? Nom nom nom 🍪. Yes?
				</p>
				<div className="flex items-center justify-center md:justify-end gap-3 mt-1">
					<button
						type="button"
						className="underline underline-offset-2 text-muted-foreground hover:text-foreground transition-colors duration-150"
						onClick={handleDeclineCookies}
					>
						No
					</button>
					<button
						type="button"
						className="underline underline-offset-2 hover:text-foreground transition-colors duration-150 font-semibold"
						onClick={handleAcceptCookies}
					>
						Yes
					</button>
				</div>
			</div>
		</div>
	);
}
