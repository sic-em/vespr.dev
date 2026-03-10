import { z } from 'zod';
import { ResourcePrice } from '@/app/generated/prisma/client';

export const submissionSchema = z.object({
	url: z.string().url({ message: 'Please enter a valid URL.' }),
	name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
	description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
	imageUrl: z
		.string()
		.url({ message: 'Please provide a valid image URL.' })
		.optional()
		.or(z.literal('')),
	categoryId: z.string().uuid({ message: 'Please select a category.' }),
	price: z.nativeEnum(ResourcePrice, {
		message: 'Please select a price category.',
	}),
	recommended: z.boolean(),
});

export type SubmissionSchema = z.infer<typeof submissionSchema>;
