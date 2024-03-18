'use server';
import { revalidatePath } from 'next/cache';
import { desc, eq } from 'drizzle-orm';

import db from '@/db/drizzle';
import { spot } from '@/db/schema';
import type { ThenArg } from '@/utils/type-helpers';

export type Spot = ThenArg<ReturnType<typeof getData>>[number];
export type UpsertSpot = Omit<Spot, 'id' | 'createdAt' | 'updatedAt'>;

export const getData = async () => {
  const data = await db.select().from(spot).orderBy(desc(spot.createdAt));
  return data;
};

export const addSpot = async (data: UpsertSpot) => {
  await db.insert(spot).values(data);

  revalidatePath('/spots');
};

export const deleteSpot = async (id: string) => {
  await db.delete(spot).where(eq(spot.id, id));

  revalidatePath('/spots');
};

export const editSpot = async (id: string, data: UpsertSpot) => {
  await db.update(spot).set(data).where(eq(spot.id, id));

  revalidatePath('/spots');
};
