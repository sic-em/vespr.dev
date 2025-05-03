'use client';
import { MoonIcon } from '@/components/icons/moon';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const ThemeToggle = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
				<MoonIcon className="w-4 h-4 mr-2 text-muted-foreground" />
				<span className="flex-1">Dark Mode</span>
				<Switch disabled className="ml-auto" />
			</div>
		);
	}

	const isDarkMode = theme === 'dark';

	const handleThemeChange = (checked: boolean) => {
		setTheme(checked ? 'dark' : 'light');
	};

	return (
		<div
			className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
			onClick={(e) => e.stopPropagation()}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.stopPropagation();
				}
			}}
			onSelect={(e) => e.preventDefault()}
		>
			<MoonIcon className="w-4 h-4 mr-4 text-muted-foreground" />
			<span className="flex-1">Dark Mode</span>
			<Switch
				checked={isDarkMode}
				onCheckedChange={handleThemeChange}
				className="ml-auto"
				aria-label="Toggle dark mode"
			/>
		</div>
	);
};
