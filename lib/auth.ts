import db from '@/lib/db';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { createAuthMiddleware } from 'better-auth/api';
import { admin, username } from 'better-auth/plugins';
import cuid from 'cuid';

export const auth = betterAuth({
	database: prismaAdapter(db, {
		provider: 'postgresql',
	}),
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		},
	},
	advanced: {
		database: {
			generateId: () => {
				return cuid();
			},
		},
	},

	plugins: [admin(), username()],
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			if (ctx.path !== '/callback/:id') {
				return;
			}

			const newSession = ctx.context.newSession;
			const userId = newSession?.user?.id;

			if (!userId) {
				return;
			}

			try {
				const account = await db.account.findFirst({
					where: { userId: userId, providerId: 'github' },
				});

				try {
					// get the user's github username
					const githubUserResponse = await fetch('https://api.github.com/user', {
						headers: {
							Authorization: `Bearer ${account?.accessToken}`,
							Accept: 'application/vnd.github.v3+json',
						},
					});

					if (!githubUserResponse.ok) {
						throw new Error(`GitHub API request failed: ${githubUserResponse.status}`);
					}

					const githubUserData = await githubUserResponse.json();
					const githubUsername = githubUserData?.login;

					if (!githubUsername) {
						return;
					}

					try {
						// update user in database
						await db.user.update({
							where: { id: userId },
							data: {
								username: githubUsername,
								displayUsername: githubUsername,
							},
						});
					} catch (dbError) {
						console.error(`Error updating user ${userId} in database:`, dbError);
					}
				} catch (fetchError) {
					console.error('Error fetching or processing GitHub user data:', fetchError);
				}
			} catch (accountError) {
				console.error('Error fetching account from DB:', accountError);
			}
		}),
	},
});
