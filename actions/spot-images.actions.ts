'use server';

import { desc, eq } from 'drizzle-orm';

import db from '@/db/drizzle';
import { spotImage } from '@/db/schema';
import { ThenArg } from '@/utils/type-helpers';

export type SpotImage = ThenArg<ReturnType<typeof getSpotImagesById>>[number];
export type UpsertSpot = Omit<
  SpotImage,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export const getSpotImagesById = async (id: string) => {
  const images = await db
    .select()
    .from(spotImage)
    .where(eq(spotImage.spotId, id))
    .orderBy(desc(spotImage.createdAt));

  return images;
};

export const addSpotImages = async (data: UpsertSpot) => {
  const [newSpotImage] = await db.insert(spotImage).values(data).returning();

  return newSpotImage;
};
