import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const migrationClient = postgres(
  'postgres://postgres:adminadmin@0.0.0.0:5432/db',
  { max: 1 }
);

migrate(drizzle(migrationClient), {
  migrationsFolder: './drizzle',
});

const queryClient = postgres(process.env.POSTGRES_CONNECTION_STRING!);
const db = drizzle(queryClient);

export default db;