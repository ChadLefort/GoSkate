import {
  boolean,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

import { point } from '@/db/geometryType';

export const spots = pgTable('spots', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description').notNull(),
  address: varchar('address', { length: 100 }).notNull(),
  addressLine2: varchar('address_line_2', { length: 100 }),
  city: varchar('city', { length: 50 }).notNull(),
  state: varchar('state', { length: 50 }).notNull(),
  zip: varchar('zip', { length: 10 }).notNull(),
  bustLevel: smallint('bust_level').default(0).notNull(),
  location: point('location', { srId: 4326 }).notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
  deletedAt: timestamp('deleted_at'),
});

export const spotRelations = relations(spots, ({ many }) => ({
  spotsToLabels: many(spotsToLabels),
  images: many(spotImages),
}));

export const labelTypeEnum = pgEnum('type', ['default', 'primary', 'secondary', 'success', 'warning', 'danger']);

export const spotLabels = pgTable('spot_labels', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description').notNull(),
  type: labelTypeEnum('type').notNull().default('default'),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
  deletedAt: timestamp('deleted_at'),
});

export const spotLabelRelations = relations(spotLabels, ({ many }) => ({
  spotsToLabels: many(spotsToLabels),
}));

export const spotsToLabels = pgTable(
  'spots_to_labels',
  {
    spotId: uuid('spot_id')
      .notNull()
      .references(() => spots.id, { onDelete: 'cascade' }),
    labelId: uuid('label_id')
      .notNull()
      .references(() => spotLabels.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.spotId, t.labelId] }),
  })
);

export const spotsToLabelsRelations = relations(spotsToLabels, ({ one }) => ({
  spot: one(spots, {
    fields: [spotsToLabels.spotId],
    references: [spots.id],
  }),
  label: one(spotLabels, {
    fields: [spotsToLabels.labelId],
    references: [spotLabels.id],
  }),
}));

export const spotImages = pgTable('spot_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  spotId: uuid('spot_id').notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  url: varchar('url', { length: 2048 }).notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
  deletedAt: timestamp('deleted_at'),
});

export const spotImagesRelations = relations(spotImages, ({ one }) => ({
  spot: one(spots, {
    fields: [spotImages.spotId],
    references: [spots.id],
  }),
}));

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
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
