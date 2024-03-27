'use server';

import { desc, eq } from 'drizzle-orm';

import db from '@/db/drizzle';
import { user } from '@/db/schema';
import type { ThenArg } from '@/utils/type-helpers';

export type User = ThenArg<ReturnType<typeof getUsers>>[number];
export type UpsertUser = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export const getUsers = async () => {
  const data = await db.select().from(user).orderBy(desc(user.createdAt));
  return data;
};

export const getUserById = async (id: string) => {
  const data = db.query.user.findFirst({
    where: (user, { eq }) => eq(user.userId, id),
  });

  return data;
};

export const addUser = async (data: UpsertUser) => {
  await db.insert(user).values(data);
};

export const editUser = async (id: string, data: UpsertUser) => {
  await db.update(user).set({ data: data }).where(eq(user.userId, id));
};
