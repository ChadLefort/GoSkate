'use server';

import { revalidatePath } from 'next/cache';
import { desc, eq, ilike } from 'drizzle-orm';

import db from '@/db/drizzle';
import { spot } from '@/db/schema';
import type { ThenArg } from '@/utils/type-helpers';

import { checkAdmin, checkLoggedIn } from './auth';

export type Spot = ThenArg<ReturnType<typeof getSpots>>[number];
export type UpsertSpot = Omit<
  Spot,
  'id' | 'slug' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export const getSpots = async () => {
  const data = await db.select().from(spot).orderBy(desc(spot.createdAt));
  return data;
};

export const getSpotBySlug = async (slug: string) => {
  const spot = await db.query.spot.findFirst({
    where: (spot, { eq }) => eq(spot.slug, slug.toLowerCase()),
  });

  return spot;
};

export const searchSpots = async (searchTerm?: string) => {
  if (!searchTerm) {
    return await getSpots();
  }

  const data = await db
    .select()
    .from(spot)
    .where(ilike(spot.name, `%${searchTerm}%`))
    .orderBy(desc(spot.createdAt));

  return data;
};

export const addSpot = async (data: UpsertSpot) => {
  const { userId } = await checkLoggedIn();

  const slug = data.name.toLowerCase().replace(/\s/g, '-');
  const existingSpot = await db.query.spot.findFirst({
    where: (spot, { eq }) => eq(spot.slug, slug),
  });

  if (!existingSpot) {
    const [newSpot] = await db
      .insert(spot)
      .values({
        ...data,
        slug,
        userId,
      })
      .returning();

    revalidatePath('/spots');

    return newSpot;
  }
};

export const deleteSpot = async (id: string) => {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    throw new Error('You must be an admin to perform this action');
  }

  await db.delete(spot).where(eq(spot.id, id));

  revalidatePath('/spots');
};

export const editSpot = async (id: string, data: UpsertSpot) => {
  await checkLoggedIn();
  await db.update(spot).set(data).where(eq(spot.id, id));

  revalidatePath('/spots');
};
