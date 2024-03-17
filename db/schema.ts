import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const spot = pgTable('spot', {
  id: serial('id'),
  name: text('name').notNull(),
  description: text('description').notNull(),
});
