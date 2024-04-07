import {
  boolean,
  json,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

import { point } from './geometryType';

export const spot = pgTable('spot', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description').notNull(),
  address: text('address').notNull(),
  addressLine2: text('address_line_2'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zip: text('zip').notNull(),
  bustLevel: smallint('bust_level').default(0).notNull(),
  location: point('location', { srId: 4326 }).notNull(),
  userId: text('userId').notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
  deletedAt: timestamp('deleted_at'),
});

export const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId').notNull(),
  data: json('data').notNull(),
  premium: boolean('premium').default(false).notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
  deletedAt: timestamp('deleted_at'),
});

export const spotImage = pgTable('spot_image', {
  id: uuid('id').defaultRandom().primaryKey(),
  spotId: uuid('spot_id').notNull(),
  userId: text('user_id').notNull(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
  deletedAt: timestamp('deleted_at'),
});
