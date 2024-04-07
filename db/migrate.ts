import { migrate } from 'drizzle-orm/postgres-js/migrator';

import db, { queryClient } from './drizzle';

const applyMigration = async () => {
  await migrate(db, { migrationsFolder: './drizzle' });
  await queryClient.end();
};

applyMigration();
