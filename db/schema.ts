import { json, pgTable, smallint, text, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

import { point } from './geometryType';

export const spot = pgTable('spot', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description').notNull(),
  address: text('address').notNull(),
  bustLevel: smallint('bust_level').default(0).notNull(),
  location: point('location', { srId: 4326 }),
  userId: text('userId').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`now()`),
});

export const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId').notNull(),
  data: json('data').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`now()`),
  deletedAt: text('deleted_at'),
});

export const spotImage = pgTable('spot_image', {
  id: uuid('id').defaultRandom().primaryKey(),
  spotId: uuid('spot_id').notNull(),
  userId: text('user_id').notNull(),
  url: text('url').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`now()`),
  deletedAt: text('deleted_at'),
});
