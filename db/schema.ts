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
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

import { point } from './geometryType';

export const spots = pgTable('spots', {
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

export const spotRelations = relations(spots, ({ many }) => ({
  spotsToLabels: many(spotsToLabels),
}));

export const labelTypeEnum = pgEnum('type', [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
]);

export const spotLabels = pgTable('spot_labels', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
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
      .references(() => spots.id),
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

export const users = pgTable('users', {
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
