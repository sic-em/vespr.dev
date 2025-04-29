import { LoginButton } from '@/components/auth/login-button';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

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

	return <div>Admin</div>;
}
