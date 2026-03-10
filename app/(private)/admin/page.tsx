import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginButton } from '@/components/auth/login-button';
import { auth } from '@/lib/auth';

export default async function AdminPage() {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user) {
		return (
			<div className="flex h-screen w-screen items-center justify-center">
				<LoginButton />
			</div>
		);
	}

	if (session.user.role !== 'admin') {
		redirect('/');
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-start px-4 sm:px-6 pt-6 pb-16">
			Admin
		</div>
	);
}
