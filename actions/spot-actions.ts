'use server';

import { revalidatePath } from 'next/cache';
import { desc, eq, sql } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import db from '@/db/drizzle';
import { spots, spotsToLabels } from '@/db/schema';
import type { Point } from '@/types/point';
import { checkAdmin, checkLoggedIn } from '@/utils/auth';
import type { AddSpot } from '@/types/spot';

export const getSpots = async () => {
  const data = await db.query.spots.findMany({
    orderBy: desc(spots.createdAt),
    with: {
      spotsToLabels: {
        columns: {
          labelId: false,
          spotId: false,
        },
        with: {
          label: true,
        },
      },
    },
    where: (spot, { isNull }) => isNull(spot.deletedAt),
  });

  return data;
};

export const getSpotLabels = async () => {
  const categories = await db.query.spotLabels.findMany();
  return categories;
};

export const getSpotBySlug = async (slug: string) => {
  const data = await db.query.spots.findFirst({
    with: {
      spotsToLabels: {
        columns: {
          labelId: false,
          spotId: false,
        },
        with: {
          label: true,
        },
      },
      images: true,
    },
    where: (spot, { eq, and, isNull }) => and(eq(spot.slug, slug), isNull(spot.deletedAt)),
  });

  return data;
};

export const searchSpots = async (searchTerm?: string) => {
  if (!searchTerm) {
    return await getSpots();
  }

  const data = await db.query.spots.findMany({
    with: {
      spotsToLabels: {
        columns: {
          labelId: false,
          spotId: false,
        },
        with: {
          label: true,
        },
      },
    },
    where: (spot, { ilike, or, and, isNull }) =>
      and(
        or(
          ilike(spot.name, `%${searchTerm}%`),
          ilike(spot.address, `%${searchTerm}%`),
          ilike(spot.city, `%${searchTerm}%`),
          ilike(spot.state, `%${searchTerm}%`)
        ),
        isNull(spot.deletedAt)
      ),

    orderBy: desc(spots.createdAt),
  });

  return data;
};

export const getNearbySpots = async ({ lng, lat }: Point, id: string) => {
  const radius = 1609.344 * 250;
  const data = await db.query.spots.findMany({
    with: {
      spotsToLabels: {
        columns: {
          labelId: false,
          spotId: false,
        },
        with: {
          label: true,
        },
      },
      images: true,
    },
    where: (spot, { eq, and, not, isNull }) =>
      and(
        not(eq(spot.id, id)),
        sql`ST_DWithin(${spot.location}, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326), ${radius})`,
        isNull(spot.deletedAt)
      ),
    limit: 6,
    orderBy: desc(spots.createdAt),
  });

  return data;
};

export const addSpot = async (data: AddSpot & { labels: string[] }) => {
  const { userId } = await checkLoggedIn();
  const slug = data.name.toLowerCase().replace(/\s/g, '-');
  const existingSpot = await db.query.spots.findFirst({
    where: (spot, { eq }) => eq(spot.slug, slug),
  });

  if (!existingSpot) {
    const [newSpot] = await db
      .insert(spots)
      .values({
        ...data,
        slug,
        userId,
      })
      .returning();

    for (const id of data.labels) {
      await db.insert(spotsToLabels).values({
        spotId: newSpot.id,
        labelId: id,
      });
    }

    revalidatePath('/spots');

    return newSpot;
  }
};

export const deleteSpot = async (id: string) => {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    throw new Error('You must be an admin to perform this action');
  }

  await db
    .update(spots)
    .set({ deletedAt: sql`now()` })
    .where(eq(spots.id, id));

  revalidatePath('/spots');
};

export const editSpot = async (id: string, data: AddSpot) => {
  await checkLoggedIn();
  await db.update(spots).set(data).where(eq(spots.id, id));

  revalidatePath('/spots');
};
