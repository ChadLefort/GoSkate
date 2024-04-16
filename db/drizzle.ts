import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '@/db/schema';

export const queryClient = postgres(process.env.POSTGRES_CONNECTION_STRING!);
const db = drizzle(queryClient, { schema });

export default db;
