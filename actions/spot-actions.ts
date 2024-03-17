'use server';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

import db from '@/db/drizzle';
import { spot } from '@/db/schema';

export const getData = async () => {
  const data = await db.select().from(spot);
  return data;
};

export const addSpot = async ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  await db.insert(spot).values({
    name,
    description,
  });

  revalidatePath('/spots');
};

export const deleteSpot = async (id: number) => {
  await db.delete(spot).where(eq(spot.id, id));

  revalidatePath('/spots');
};

export const editSpot = async (
  id: number,
  { name, description }: { name: string; description: string }
) => {
  await db
    .update(spot)
    .set({
      name,
      description,
    })
    .where(eq(spot.id, id));

  revalidatePath('/spots');
};
