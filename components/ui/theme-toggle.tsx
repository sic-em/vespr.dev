'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from './button';

export const ThemeToggle = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <Button variant="outline" size="icon" className="rounded-[8px] w-9 h-9" />;
	}

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
			className="rounded-[8px]"
		>
			<AnimatePresence initial={false} mode="wait">
				<motion.div
					key={theme === 'dark' ? 'sun' : 'moon'}
					initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
					animate={{ opacity: 1, scale: 1, rotate: 0 }}
					exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
					transition={{ duration: 0.2, ease: 'easeOut' }}
					className="flex items-center justify-center"
				>
					{theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
				</motion.div>
			</AnimatePresence>
		</Button>
	);
};
