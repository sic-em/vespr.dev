'use client';

import { Button } from '@/components/ui/button';
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import type { Category, Resource } from '@/prisma/app/generated/prisma/client';
import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface CmdKSearchProps {
	categories: Category[];
	resources: Resource[];
}

export const CmdKSearch = ({ categories, resources }: CmdKSearchProps) => {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const router = useRouter();

	const recentResources = useMemo(() => resources.slice(0, 50), [resources]);

	const filteredResources = useMemo(() => {
		let list = resources;

		// 1. apply category filter
		if (selectedCategory) {
			list = list.filter((resource) => resource.categoryId === selectedCategory);
		}

		// 2. apply search filter
		if (search) {
			list = list.filter(
				(resource) =>
					resource.name?.toLowerCase().includes(search.toLowerCase()) ||
					resource.description?.toLowerCase().includes(search.toLowerCase()),
			);
		} else if (!selectedCategory) {
			// 3. if no search and no category, show recent
			list = recentResources;
		}

		return list;
	}, [search, selectedCategory, resources, recentResources]);

	// group resources by category
	const resourcesByCategory = useMemo(() => {
		return filteredResources.reduce(
			(acc, resource) => {
				const categoryId = resource.categoryId;
				// make sure categoryId is not null before using it as an index
				if (categoryId) {
					if (!acc[categoryId]) {
						acc[categoryId] = [];
					}
					acc[categoryId].push(resource);
				}
				return acc;
			},
			{} as Record<string, Resource[]>,
		);
	}, [filteredResources]);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	const handleSelect = (resource: Resource) => {
		const category = categories.find((cat) => cat.id === resource.categoryId);
		if (category) {
			router.push(`/browse/${category.slug}/${resource.id}`);
			setOpen(false);
		}
	};

	useEffect(() => {
		if (!open) {
			setSelectedCategory(null);
			setSearch('');
		}
	}, [open]);

	return (
		<>
			<Button
				onClick={() => setOpen(true)}
				variant="outline"
				className="text-muted-foreground w-56 justify-between rounded-[8px]"
			>
				<div className="flex items-center">
					<SearchIcon className="w-4 h-4" />
					<span className="ml-2">Search...</span>
				</div>
				<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium text-muted-foreground bg-muted-foreground/20 opacity-100">
					<span className="text-xs">⌘</span>K
				</kbd>
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput
					placeholder="Search resources by name or description..."
					value={search}
					onValueChange={setSearch}
				/>
				{/* Category Filter Pills */}
				{/* <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-dashed">
					<Badge
						variant={selectedCategory === null ? 'default' : 'outline'}
						className="cursor-pointer"
						onClick={() => setSelectedCategory(null)}
					>
						All
					</Badge>
					{categories.map((category) => (
						<Badge
							key={category.id}
							variant={selectedCategory === category.id ? 'default' : 'outline'}
							className="cursor-pointer"
							onClick={() => setSelectedCategory(category.id)}
						>
							{category.name}
						</Badge>
					))}
				</div> */}
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					{Object.keys(resourcesByCategory).length === 0 &&
						search === '' &&
						selectedCategory === null && (
							<CommandGroup heading="Recent Resources">
								{recentResources.map((resource) => (
									<CommandItem
										key={resource.id}
										onSelect={() => handleSelect(resource)}
										value={`${resource.name}-${resource.description}-recent`}
									>
										<span>{resource.name}</span>
									</CommandItem>
								))}
							</CommandGroup>
						)}
					{Object.entries(resourcesByCategory).map(([categoryId, categoryResources]) => {
						const category = categories.find((cat) => cat.id === categoryId);
						return (
							category && (
								<CommandGroup key={categoryId} heading={category.name}>
									{categoryResources.map((resource) => (
										<CommandItem
											key={resource.id}
											onSelect={() => handleSelect(resource)}
											value={`${resource.name}-${resource.description}`}
										>
											<span>{resource.name}</span>
										</CommandItem>
									))}
								</CommandGroup>
							)
						);
					})}
				</CommandList>
			</CommandDialog>
		</>
	);
};
