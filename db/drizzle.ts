import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import * as schema from '@/db/schema';

declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;

export const queryClient = postgres(process.env.POSTGRES_CONNECTION_STRING!);

// Fix for too many clients already error
if (process.env.NODE_ENV === 'production') {
  db = drizzle(queryClient, { schema });
} else {
  if (!global.db) global.db = drizzle(queryClient, { schema });
  db = global.db;
}

export default db;
