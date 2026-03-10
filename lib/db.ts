import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

import { PrismaClient } from '@/app/generated/prisma/client';

neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
const db = new PrismaClient({
	adapter,
	//   log: ['query', 'info', 'warn', 'error'],
});

export default db;
