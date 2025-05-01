import { z } from 'zod';

export const submissionSchema = z.object({
	url: z.string().url({ message: 'Please enter a valid URL.' }),
	name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
	description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
	imageUrl: z.string().url({ message: 'Please provide a valid image URL.' }),
	categoryId: z.string().uuid({ message: 'Please select a category.' }),
	tags: z.string().optional(), // Comma-separated tags
	openSource: z.boolean(),
	paid: z.boolean(),
	recommended: z.boolean(),
});

export type SubmissionSchema = z.infer<typeof submissionSchema>;
