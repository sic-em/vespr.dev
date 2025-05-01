interface UserPageProps {
	params: Promise<{
		userId: string;
	}>;
}

export default async function UserPage(props: UserPageProps) {
	const params = await props.params;
	const { userId } = params;

	return (
		<div className="flex min-h-screen flex-col items-center justify-start px-4 sm:px-6 pt-6 pb-16">
			{userId}
		</div>
	);
}
