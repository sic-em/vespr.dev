import { Label } from '@/components/ui/label';

interface UserProfileStatsProps {
	totalViews: number;
	totalBookmarks: number;
}

export function UserProfileStats({ totalViews, totalBookmarks }: UserProfileStatsProps) {
	return (
		<div className="space-y-3 text-sm mb-6 pt-6 border-t border-dashed">
			<div className="flex justify-between items-center">
				<Label>Total Views</Label>
				<span>{totalViews.toLocaleString()}</span>
			</div>
			<div className="flex justify-between items-center">
				<Label>Total Bookmarks</Label>
				<span>{totalBookmarks.toLocaleString()}</span>
			</div>
		</div>
	);
}
