import { pgTable, smallint, text, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

import { point } from './geometryType';

export const spot = pgTable('spot', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  address: text('address').notNull(),
  bustLevel: smallint('bust_level').default(0).notNull(),
  location: point('location', { srId: 4326 }),
  createdAt: text('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`now()`),
});
