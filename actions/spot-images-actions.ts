'use server';

import { desc, eq } from 'drizzle-orm';

import db from '@/db/drizzle';
import { spotImages } from '@/db/schema';
import type { AddSpotImage } from '@/types/spot-image';

export const getSpotImagesById = async (id: string) => {
  const images = await db
    .select()
    .from(spotImages)
    .where(eq(spotImages.spotId, id))
    .orderBy(desc(spotImages.createdAt));

  return images;
};

export const addSpotImages = async (data: AddSpotImage) => {
  const [newSpotImage] = await db.insert(spotImages).values(data).returning();

  return newSpotImage;
};
