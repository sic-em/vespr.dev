Object.defineProperty(exports, '__esModule', { value: true });
const client_1 = require('./app/generated/prisma/client');
const prisma = new client_1.PrismaClient();
const categories = [
	{ name: 'Courses', slug: 'courses' },
	{ name: 'Libraries', slug: 'libraries' },
	{ name: 'Services', slug: 'services' },
	{ name: 'Components & Blocks', slug: 'components-blocks' },
	{ name: 'Tools', slug: 'tools' },
	{ name: 'Articles', slug: 'articles' },
	{ name: 'Icons', slug: 'icons' },
	{ name: 'Fonts', slug: 'fonts' },
	{ name: 'Illustrations', slug: 'illustrations' },
	{ name: 'UI/UX', slug: 'ui-ux' },
	{ name: 'Vibing', slug: 'vibing' },
	{ name: 'Misc', slug: 'misc' },
];
async function main() {
	console.log('Seeding categories...');
	for (const category of categories) {
		await prisma.category.upsert({
			where: { slug: category.slug },
			update: {},
			create: {
				name: category.name,
				slug: category.slug,
			},
		});
		console.log(`Upserted category: ${category.name}`);
	}
	console.log('Seeding finished.');
}
main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
